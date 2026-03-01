---
lang: zh-CN
title: 基础-00-YAML格式
---

本文只介绍自动战斗中用到的 YAML 语法。完整教程可参阅 [YAML 入门](https://www.runoob.com/w3cnote/yaml-intro.html)。

你可以在 [yaml.cn](https://yaml.cn/) 粘贴下方任何示例，实时查看解析结果。

## 1. 对象

```yaml
name: "DoctorReid"
github_homepage: "https://github.com/DoctorReid"
level: 60
```

通过 `属性: 值` 描述一个对象，属性之间没有顺序要求。

### 1.1. 值类型

- **字符串** — 用双引号包围，例如 `"DoctorReid"`
- **数值** — 不带引号的纯数字，例如 `60`

## 2. 数组

多个对象组成数组时，用 `- ` 标记每个元素的起始：

```yaml
- name: "DoctorReid"
  github_homepage: "https://github.com/DoctorReid"
  level: 60
- name: "小巡夜"
  github_homepage: "https://github.com/yokuminto"
  level: 60
```

**缩进规则**：同一对象的所有属性，起始位置必须对齐。第一个属性前是 `- `（横线+空格），后续属性前是两个空格。

## 3. 嵌套

对象的属性值可以是另一个对象或数组：

```yaml
org_name: "一条龙"
members:
  - name: "DoctorReid"
    github_homepage: "https://github.com/DoctorReid"
    level: 60
  - name: "小巡夜"
    github_homepage: "https://github.com/yokuminto"
    level: 60
keywords: ["脚本", "自动化"]
other_info:
  homepage: "https://one-dragon.com/"
  create_date: "2024-09-01"
```

- `members` — 值是一个数组，数组元素是对象
- `keywords` — 值是一个字符串数组（方括号简写）
- `other_info` — 值是一个嵌套对象

### 3.1. 缩进规则

每深入一层嵌套，增加 **2 个空格** 的缩进。

```yaml
keywords: ["脚本", "自动化"]
# 等价于 ↓
keywords:
  - "脚本"
  - "自动化"
```

### 3.2. 多层嵌套

嵌套可以无限层级，关键是保持缩进正确：

```yaml
members:
  - name: "DoctorReid"
    friends:
      - name: "a"
      - name: "b"
```

**总结**：YAML 的本质就是用缩进（空格）来表达层级关系，让结构化数据既好看又好读。

## 4. 注释

以 `#` 开头的行是注释，不会被解析：

```yaml
# 这是注释
name: "DoctorReid"  # 行尾注释也可以
```
