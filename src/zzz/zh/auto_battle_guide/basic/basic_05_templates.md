---
lang: zh-CN
title: 基础-05-模板系统
---

模板是实现脚本模块化和代码复用的核心机制。它将复杂的逻辑拆分为易于管理的小文件，通过引用组装起来。

## 1. 三层模板体系

一条龙的配置按职责分为三层，每层存放在不同的目录：

```
config/
├── auto_battle/                # 1. 战斗模板（顶层策略）
│   └── 全配队通用.yml
├── auto_battle_state_handler/  # 2. 状态模板（中层决策）
│   ├── 速切模板-全角色.yml
│   └── 站场模板-安比.yml
└── auto_battle_operation/      # 3. 操作模板（底层动作）
    └── 安比-3A特殊攻击.yml
```

| 层级 | 路径 | 职责 | 包含内容 |
|---|---|---|---|
| 战斗模板 | `config/auto_battle/` | 顶层策略 | `scenes`、`priority`、全局参数 |
| 状态模板 | `config/auto_battle_state_handler/` | 中层决策 | 角色决策树、通用逻辑 |
| 操作模板 | `config/auto_battle_operation/` | 底层执行 | 具体的连招按键序列 |

**核心引用规则**：上层可以引用同层或下层，**底层不能引用上层**。

- ✅ 战斗模板 → 状态模板 → 操作模板
- ✅ 状态模板 → 状态模板（模板互相嵌套）
- ✅ 操作模板 → 操作模板（连招互相组装）
- ❌ 操作模板 → 状态模板（禁止）

## 2. 状态模板 (state_template)

在 `handlers` 中通过 `state_template` 引用外部的状态处理模板。

### 2.1. 引用方式

```yaml
handlers:
  - states: "[按键-连携技-左, 0, 12] | [按键-连携技-右, 0, 12]"
    sub_handlers:
      - states: "[前台-朱鸢]"
        operations: ...
  - state_template: "站场模板-击破站场"    # 引用外部模板
```

> 出现 `state_template` 时，`states`/`operations`/`sub_handlers` 均无效。

### 2.2. 模板文件结构

状态模板存放在 `config/auto_battle_state_handler/` 目录，结构如下：

```yaml
# 文件: 站场模板-安比.sample.yml
handlers:
  - states: "[前台-安比]"
    sub_handlers:
      - states: "[按键可用-终结技]"
        operations:
          - op_name: "按键-终结技"
      - states: ""
        operations:
          - operation_template: "安比-3A特殊攻击"
```

### 2.3. 嵌套

`sub_handlers` 和 `state_template` 可以不断嵌套。一个状态模板可以引用另一个状态模板：

```yaml
# 速切模板-全角色.yml → 分派到各角色专属模板
handlers:
  - state_template: "站场模板-安比"
  - state_template: "站场模板-艾莲"
  - state_template: "站场模板-朱鸢"
```

完整的内置状态模板列表见 [状态处理模板](../reference/handler_templates.md)。

## 3. 操作模板 (operation_template)

在 `operations` 中通过 `operation_template` 引用外部的操作模板。

### 3.1. 引用方式

```yaml
operations:
  - op_name: "设置状态"
    state: "自定义-动作不打断"
    seconds: 1
  - operation_template: "安比-3A特殊攻击"    # 引用外部模板
  - op_name: "按键-普通攻击"
```

### 3.2. 模板文件结构

操作模板存放在 `config/auto_battle_operation/` 目录：

```yaml
# 文件: 安比-3A特殊攻击.sample.yml
operations:
  - op_name: "按键-普通攻击"
    repeat: 3
    post_delay: 0.1
  - op_name: "按键-特殊攻击"
    post_delay: 0.1
```

### 3.3. 操作模板的嵌套与组装

操作模板之间可以互相引用，像"零件"一样组装成更复杂的连招：

```yaml
# 安比-普攻接特殊.yml（组装模板）
operations:
  - operation_template: "安比-三连普攻"       # 零件1
  - op_name: "等待秒数"
    seconds: 0.2
  - operation_template: "安比-特殊技收尾"     # 零件2
```

完整的内置操作模板列表见 [操作模板](../reference/operation_templates.md)。

## 4. 全局参数

全局参数位于战斗模板的顶层，控制自动战斗系统的整体行为。

### 4.1. 脚本元数据

```yaml
author: "DoctorReid"
version: "1.0"
introduction: "全配队通用脚本"
```

### 4.2. 识别间隔

控制各类画面识别的频率。支持固定数字或随机区间 `[下限, 上限]`：

```yaml
check_dodge_interval: 0.02                  # 闪避识别间隔
check_agent_interval: [0.4, 0.6]            # 角色识别间隔（随机）
check_special_attack_interval: [0.4, 0.6]   # 特殊攻击就绪检测
check_ultimate_interval: [0.4, 0.6]         # 终结技就绪检测
check_chain_interval: [0.9, 1.1]            # 连携技就绪检测
check_quick_interval: [0.9, 1.1]            # 快速支援就绪检测
auto_lock_interval: 5                       # 自动锁定间隔，-1 = 不自动锁定
auto_turn_interval: 3                       # 镜头自动转向间隔
```

### 4.3. 终结技限制

通过 `allow_ultimate` 限制终结技只能由特定角色使用：

```yaml
allow_ultimate:
  - agent_type: "强攻"      # 按角色类型
  - agent_name: "安比"       # 按角色名称
```

不配置 `allow_ultimate` 时，所有角色都可以使用终结技。

## 5. 默认模板使用的自定义状态

内置模板定义了若干常用的自定义状态，编写配置时可以直接使用：

| 自定义状态 | 用途 |
|---|---|
| `自定义-黄光切人` | 格挡切人后控制后摇等待 |
| `自定义-红光闪避` | 闪避后控制角色特定后摇 |
| `自定义-快速支援换人` | 快速支援后摇控制 |
| `自定义-连携换人` | 连携后摇 + 失衡判断 |
| `自定义-临时站场` | 插队站场（如朱鸢出场打几发再切回） |
| `自定义-动作不打断` | 防止长动作被触发器打断（如青衣重击） |
| `自定义-合轴时间` | 一套连招结束后，通知系统可以换人 |

## 6. 角色识别原理

- 脚本启动时对全部角色进行匹配，连续 5 次一致后锁定识别结果
- 切人按键（普通切换、连携、快速支援）会自动更新角色列表
- 同时更新能量、终结技、特殊攻击状态
