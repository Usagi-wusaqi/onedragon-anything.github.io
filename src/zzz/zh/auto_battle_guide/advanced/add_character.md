---
lang: zh-CN
title: 如何新增角色
---

得益于 `全配队通用` 的解耦设计，新增角色只需 4 步，无需改动顶层战略文件。

> 阅读本文前，建议先掌握 [架构解析](architecture.md)。

---

## 第 1 步：创建操作模板（动作层）

为角色定义所有基础连招。

**目录**：`config/auto_battle_operation/`

创建若干 `.yml` 文件，每个文件代表一个原子化连招。例如为"比利"创建：

- `比利-普通攻击.yml`
- `比利-上Buff动作.yml`
- `比利-终结技.yml`

每个文件包含具体的按键序列和延迟：

```yaml
operations:
  - op_name: "按键-普通攻击"
    post_delay: 0.3
  - op_name: "按键-普通攻击"
    post_delay: 0.3
  - op_name: "按键-普通攻击"
    post_delay: 0.5
```

---

## 第 2 步：创建角色"大脑"（决策层）

为角色创建速切模板，定义在前台时的决策逻辑。

**目录**：`config/auto_battle_state_handler/`

创建 `速切模板-比利.yml`：

```yaml
handlers:
  - states: "[前台-比利]"
    debug_name: "比利决策树"
    sub_handlers:
      # 优先使用终结技
      - states: "[前台-终结技可用]"
        operations:
          - op_name: "按键-终结技"

      # 常规输出
      - states: ""
        operations:
          - operation_template: "比利-普通攻击"
          - op_name: "设置状态"
            state: "自定义-合轴时间"    # 关键：打完后发出"可换人"信号
```

**关键点**：连招结束后设置 `自定义-合轴时间` 状态，这个信号会被顶层的 `[连招结束事件]` 场景（priority: 80）捕获，触发 `轮换-合轴-全角色` 来判断是否需要换人。

---

## 第 3 步：注册到分派器

告诉角色分派器新增了一个角色。

**文件**：`config/auto_battle_state_handler/速切模板-全角色.yml`

在 `handlers` 列表中添加一行：

```yaml
handlers:
  - state_template: "速切模板-比利"    # ← 新增此行
  - state_template: "速切模板-安比"
  - state_template: "速切模板-艾莲"
  # ...
```

这样当系统识别到比利在前台时，就会自动调用他的专属模板。

---

## 第 4 步：融入团队轮换

定义比利在后台时的上场时机。需要修改两个轮换模板：

### 4a. 合轴轮换（计划换人）

**文件**：`config/auto_battle_state_handler/轮换-合轴-全角色.yml`

当队友的连招结束（`自定义-合轴时间` 触发）后，判断是否需要切比利上场补增益：

```yaml
handlers:
  # ... 其他角色的逻辑 ...
  - states: "![前台-比利] & [比利-冷却,0,0] & [比利-增益即将消失,-5,0]"
    debug_name: "合轴切换比利补增益"
    operations:
      - op_name: "按键-切换角色"
        agent_name: "比利"
```

### 4b. 紧急轮换（突发换人）

**文件**：`config/auto_battle_state_handler/轮换-紧急-全角色.yml`

每次主循环开始前检查是否有突发的换人需求：

```yaml
handlers:
  # ... 其他角色的逻辑 ...
  - states: "![前台-比利] & [敌人-火属性弱点] & [比利-在队]"
    debug_name: "紧急切换比利打弱点"
    operations:
      - op_name: "按键-切换角色"
        agent_name: "比利"
```

---

## 总结

| 步骤 | 操作 | 文件位置 |
|---|---|---|
| 1 | 创建操作模板 | `auto_battle_operation/比利-*.yml` |
| 2 | 创建角色大脑 | `auto_battle_state_handler/速切模板-比利.yml` |
| 3 | 注册到分派器 | `auto_battle_state_handler/速切模板-全角色.yml` |
| 4 | 融入团队轮换 | `轮换-合轴-全角色.yml` + `轮换-紧急-全角色.yml` |

整个过程**不需要修改**顶层的 `全配队通用.yml`，这正是事件驱动架构的优势。
