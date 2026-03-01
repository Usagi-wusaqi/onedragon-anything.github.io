---
lang: zh-CN
title: 内置操作模板
---

脚本内置了大量角色指令模板，存放在 `config/auto_battle_operation` 目录下，均以 `.sample.yml` 结尾。

你可以在自定义指令中通过 `operation_template` 引用它们，例如：

```yaml
operations:
  - operation_template: "安比-3A特殊攻击"
```

关于指令模板的详细用法，请参考 [功能-自定义指令](./feat_custom_op.md) 的 1.7 节。

> **注意**：不要修改 `.sample.yml` 文件，代码同步时会被覆盖。请复制后改名使用。

---

## 示例

以下展示几个典型模板的内容，帮助理解指令模板的结构。

<details>
<summary> 安比-3A特殊攻击 </summary>

三段普攻接特殊攻击，每步之间调好等待时间保持连贯。

```yaml
operations:
  - op_name: "按键-普通攻击"
    data: []
  - op_name: "等待秒数"
    data: ["0.3"]
  - op_name: "按键-普通攻击"
    data: []
  - op_name: "等待秒数"
    data: ["0.5"]
  - op_name: "按键-普通攻击"
    data: []
  - op_name: "等待秒数"
    data: ["0.9"]
  - op_name: "按键-特殊攻击"
    data: []
  - op_name: "等待秒数"
    data: ["1.4"]
  - op_name: "按键-普通攻击"
    data: []
  - op_name: "等待秒数"
    data: ["0.2"]
  - op_name: "按键-普通攻击"
    data: []
  - op_name: "等待秒数"
    data: ["1.0"]
```
</details>

<details>
<summary> 通用-闪A </summary>

闪避后接普攻。设置 `自定义-动作不打断` 状态防止被其他触发器打断，同时嵌套引用了 `通用-闪避-左` 模板。

```yaml
# 闪避普攻 普攻后摇等待时间各角色不同 由后续动作控制
operations:
  - op_name: "设置状态"
    state: "自定义-动作不打断"
    seconds: 1
  - operation_template: "通用-闪避-左"
  - op_name: "按键-普通攻击"
    post_delay: 0.1
    repeat: 10
```
</details>

<details>
<summary> 朱鸢-蓄力3A </summary>

使用 `按键-普通攻击-按下`/`-松开` 后缀变体实现蓄力按键。首次需接蓄力A或闪A一次，后续可循环触发。

```yaml
operations:
  - op_name: "按键-普通攻击-松开"
  - op_name: "等待秒数"
    seconds: 0.1
  - op_name: "按键-普通攻击-按下"
  - op_name: "等待秒数"
    seconds: 0.3
  - op_name: "按键-普通攻击-按下"
  - op_name: "等待秒数"
    seconds: 0.3
  - op_name: "按键-普通攻击-按下"
  - op_name: "等待秒数"
    seconds: 0.3
  - op_name: "按键-普通攻击-按下"
  - op_name: "等待秒数"
    seconds: 0.3
  - op_name: "按键-普通攻击-按下"
  - op_name: "等待秒数"
    seconds: 0.3
  - op_name: "按键-普通攻击-按下"
  - op_name: "等待秒数"
    seconds: 0.3
  - op_name: "等待秒数"
    seconds: 1
```
</details>

---

## 通用模板

| 模板名称 | 说明 |
|---|---|
| `通用-快速支援` | 快速支援通用操作 |
| `通用-连携攻击` | 连携攻击通用操作 |
| `通用-切人普通攻击` | 切换角色后普攻衔接 |
| `通用-闪A` | 闪避后接普攻 |
| `通用-闪避-前` | 向前闪避 |
| `通用-闪避-左` | 向左闪避 |
| `通用-特殊攻击合轴` | 特殊攻击合轴通用操作 |
| `通用-支援攻击` | 支援攻击通用操作 |
| `通用-终结技` | 终结技通用操作 |
| `双反-上一个` | 双反切上一个角色 |
| `双反-下一个` | 双反切下一个角色 |
| `连携-左` | 连携技按左 |
| `连携-右` | 连携技按右 |
| `连携-取消` | 取消连携技 |
| `标准-支援攻击模板` | 标准支援攻击模板 |

## 角色模板

角色专属的指令模板覆盖了 40+ 个角色，共 300+ 个模板。完整列表请查看源码目录：

[config/auto_battle_operation](https://github.com/OneDragon-Anything/ZenlessZoneZero-OneDragon/tree/main/config/auto_battle_operation)

模板命名规则为 `角色名-动作名.sample.yml`，例如 `艾莲-3A.sample.yml`。引用时不需要 `.sample.yml` 后缀：

```yaml
operations:
  - operation_template: "艾莲-3A"
```
