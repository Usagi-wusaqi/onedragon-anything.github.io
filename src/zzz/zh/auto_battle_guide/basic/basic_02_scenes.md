---
lang: zh-CN
title: 基础-02-场景
---

场景 (`scenes`) 是组织所有战斗决策的顶层容器。一个配置文件由一个 `scenes` 数组构成，每个场景描述了"什么时候做什么"。

## 1. 场景结构

```yaml
scenes:
  - triggers: ["闪避识别-红光"]      # 触发条件
    priority: 99                      # 优先级
    interval: 1                       # 最小触发间隔（秒）
    handlers:                         # 处理方法数组
      - states: "[闪避识别-红光, 0, 1]"
        operations:
          - op_name: "按键-闪避"

  - triggers: []                      # 空 = 默认场景
    interval: 0.02
    handlers:
      - states: "[前台-击破]"
        operations:
          - op_name: "按键-普通攻击"
```

### 场景属性

| 属性 | 说明 |
|---|---|
| `triggers` | 触发条件数组。有触发器 = 处理突发事件；空数组 = 默认常规循环 |
| `priority` | 场景优先级，数字越大越高。用于控制打断关系 |
| `interval` | 该场景连续触发的最小间隔（秒） |
| `handlers` | 处理方法数组，场景被激活后按顺序执行匹配 |

## 2. 触发器 (Triggers)

触发器是一个字符串数组，每个元素是一个状态名。当脚本识别到数组中的任一状态时，该场景就会被尝试触发。

```yaml
# 闪避场景：三种闪光信号都触发同一个场景
- triggers: ["闪避识别-黄光", "闪避识别-红光", "闪避识别-声音"]
  handlers:
    - states: "[闪避识别-黄光, 0, 1]"    # 再用 states 细分
      operations: ...
    - states: "[闪避识别-红光, 0, 1]"
      operations: ...
```

**两种场景**：
- **有触发器**：处理偶发的突发事件（闪避、连携、快速支援）
- **无触发器** (`triggers: []`)：默认的常规连招循环，只能有一个

### 常见触发器模板

```yaml
scenes:
  - triggers: ["闪避识别-黄光", "闪避识别-红光", "闪避识别-声音"]
    interval: 1
    priority: 99
    handlers: ...

  - triggers: ["按键可用-快速支援"]
    interval: 1
    handlers: ...

  - triggers: ["按键可用-连携技"]
    interval: 1
    handlers: ...

  - triggers: []
    interval: 0.02
    handlers: ...
```

## 3. 优先级与打断

### 3.1. 基本规则

- 场景正在执行时，**只有更高优先级的场景** 可以打断它
- **同优先级** 的场景互不打断
- **没有设置优先级** 的场景可被任意打断

```yaml
scenes:
  - triggers: ["闪避识别-黄光"]
    interval: 1
    priority: 99          # 最高优先级
    handlers: ...

  - triggers: ["闪避识别-红光"]
    interval: 1
    priority: 99          # 与黄光同优先级，互不打断
    handlers: ...

  - triggers: ["按键可用-连携技"]
    interval: 1
    priority: 98          # 比闪避低，闪避可以打断连携
    handlers: ...

  - triggers: []
    interval: 0.02        # 没有 priority，可被任意打断
    handlers: ...
```

### 3.2. 事件驱动与抢占模型

场景的运作不是简单的"从高到低轮询"，而是 **事件驱动 + 抢占** 模型：

1. **监听**：每个场景将其 `triggers` 注册到系统
2. **唤醒**：当某个状态被识别到，系统唤醒所有监听该状态的场景
3. **仲裁**：多个场景同时被唤醒时，只有 `priority` 最高的执行

**执行期间的打断逻辑**：

- 场景进入执行状态后，系统 **屏蔽** 所有优先级 ≤ 当前场景的触发器
- 但 **持续监听** 优先级 > 当前场景的触发器
- 高优先级场景触发时，**立即打断** 当前操作并接管控制

> 例如：`priority: 9` 的普攻连招执行到一半，突然出现红光 → `priority: 99` 的闪避场景立即打断连招 → 执行闪避 → 完成后恢复正常监听。

### 3.3. 嵌套触发注意事项

切人动作（如连携换人）会触发 `前台-XX` 状态的变化，可能意外激活其他触发器。编写时需注意避免场景之间的意外嵌套打断。

## 4. 处理器 (Handlers)

处理器定义了"在什么条件下执行什么操作"，是场景内的决策逻辑。

### 4.1. 处理器属性

| 属性 | 说明 |
|---|---|
| `states` | 状态表达式，为真时执行该处理器 |
| `operations` | 操作指令数组 |
| `sub_handlers` | 子处理器数组，用于进一步细分判断 |
| `state_template` | 引用状态处理模板（出现时 states/operations/sub_handlers 无效） |
| `interrupt_states` | 打断表达式，匹配时中断当前操作。子处理器继承父级（OR 合并） |
| `debug_name` | 调试日志中显示的名称，方便排查 |

### 4.2. 执行逻辑

脚本按顺序遍历 `handlers` 数组：

1. 判断当前处理器的 `states` 是否为真
2. 如果为真：
   - 有 `operations` → 执行操作
   - 有 `sub_handlers` → 递归进入子级继续判断
3. 如果为假 → 继续下一个处理器

**等价于一个 IF-ELIF-ELSE 链**：

```yaml
handlers:
  - states: "[条件A]"                    # IF 条件A
    operations: ...
  - states: "[条件B]"                    # ELIF 条件B
    operations: ...
  - states: ""                           # ELSE（空字符串 = 永远为真）
    operations: ...
```

### 4.3. 子处理器 (sub_handlers)

当需要在某个条件下进一步细分时，使用 `sub_handlers` 代替 `operations`：

```yaml
handlers:
  - states: "[前台-安比]"
    sub_handlers:
      - states: "[按键可用-终结技]"          # IF 安比在前台 且 终结技可用
        operations:
          - op_name: "按键-终结技"
      - states: "[安比-特殊技可用]"          # ELIF 安比在前台 且 特殊技可用
        operations:
          - op_name: "按键-特殊攻击"
      - states: ""                           # ELSE 安比在前台 → 默认普攻
        operations:
          - op_name: "按键-普通攻击"
```

这等价于把 `[前台-安比]` 提到外面，省去每个子级重复写，逻辑上更直观。

### 4.4. interrupt_states

`interrupt_states` 用于定义一个"紧急中断"条件。当处理器正在执行 `operations` 时，如果 `interrupt_states` 匹配，操作会被立即中断。

```yaml
handlers:
  - states: "[前台-安比]"
    interrupt_states: "[闪避识别-红光]"    # 执行到一半遇到红光就中断
    operations:
      - op_name: "按键-普通攻击"
        repeat: 10
```

子处理器会**继承**父级的 `interrupt_states`（以 OR 逻辑合并）。

## 5. 编写建议

### 5.1. 触发器选择

- 偶发的突发事件（闪避、连携、快速支援）→ 用触发器
- 高频的常规逻辑 → 放在默认场景中

### 5.2. 攻击按键

建议在游戏设置中将普通攻击单独映射到一个按键，避免鼠标左击与连携技冲突。

### 5.3. 指令长度

不建议在单个处理器中放过多操作指令。过长的 operations 在被打断后需要从头重来。

### 5.4. 切换角色后的过渡

切人后角色识别需要时间，建议用自定义状态做过渡：

```yaml
# 切人时设置状态
- op_name: "按键-切换角色-下一个"
  post_delay: 0.2
- op_name: "设置状态"
  state: "自定义-黄光切人"
  seconds: 3

# 在主循环中判断
- states: "[自定义-黄光切人, 0, 3]"
  operations:
    # ... 切人后的过渡动作
```

### 5.5. 失衡判断取巧

目前没有直接的"敌人失衡"状态，可通过判断最近是否按过连携技来粗略判断：

```yaml
states: "[按键-连携技-左, 0, 12] | [按键-连携技-右, 0, 12]"
```

## 6. 调试方法

### 6.1. 指令模板调试

在训练场使用 **战斗助手 → 指令调试**（F9）。建议开启无敌、关闭失衡，逐步增加指令直到连招流畅循环。

### 6.2. 场景调试

在 **战斗助手 → 自动战斗** 中使用调试按钮，可对当前截图执行一次"识别 → 判断 → 执行"流程。
