import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/sr/zh/": [
    {
      text: "简介",
      icon: "home",
      link: "home"
    },
    {
      text: "快速安装",
      icon: "rocket",
      link: "quickstart"
    },
    {
      text: "功能说明",
      icon: "lightbulb",
      prefix: "docs",
      children: [
        {
          text: "功能-一条龙",
          link: "feat_one_dragon"
        },
        {
          text: "功能-锄大地",
          link: "feat_world_patrol"
        },
        {
          text: "功能-模拟宇宙",
          link: "feat_sim_uni"
        }
      ]
    }
  ],
  "/zzz/zh/": [
    {
      text: "项目简介",
      icon: "home",
      link: "home",
    },
    {
      text: "快速开始",
      icon: "rocket",
      link: "quickstart",
    },
    {
      text: "必要设置",
      icon: "triangle-exclamation",
      link: "config",
    },
    {
      text: "常见问题",
      icon: "question",
      link: "faq",
    },
    {
      text: "功能说明",
      icon: "lightbulb",
      children: [
        {
          text: "功能-战斗助手",
          link: "feat_battle_assistant"
        },
        {
          text: "功能-一条龙",
          collapsible: true,
          children: [
            {
              text: "快速开始-一条龙",
              link: "feat_one_dragon/quickstart"
            },
            {
              text: "随便观",
              link: "feat_one_dragon/suibian"
            },
            {
              text: "恶名狩猎计划",
              link: "feat_one_dragon/notorious_hunt"
            },
            {
              text: "体力计划",
              link: "feat_one_dragon/charge_plan"
            },
            {
              text: "咖啡计划",
              link: "feat_one_dragon/coffee"
            },
            {
              text: "零号空洞",
              link: "feat_one_dragon/hollow_zero"
            },
            {
              text: "锄大地",
              link: "feat_one_dragon/world_patrol"
            },
            {
              text: "式舆防卫战",
              link: "feat_one_dragon/shiyu_defense"
            },
          ]
        },
        {
          text: "功能-游戏助手",
          link: "feat_game_assistant"
        },
        {
          text: "功能-通知系统",
          link: "feat_notify"
        },
        {
          text: "功能-手柄支持",
          link: "feat_gamepad"
        },
      ],
    },
    {
      text: "自动战斗教程",
      icon: "book",
      prefix: "auto_battle_guide",
      children: [
        {
          text: "基础入门",
          collapsible: true,
          prefix: "basic/",
          children: [
            {
              text: "基础-00-YAML格式",
              link: "basic_00_yaml",
            },
            {
              text: "基础-01-自动战斗简介",
              link: "basic_01_intro",
            },
            {
              text: "基础-02-场景",
              link: "basic_02_scenes",
            },
            {
              text: "基础-03-状态表达式",
              link: "basic_03_states",
            },
            {
              text: "基础-04-操作指令",
              link: "basic_04_operations",
            },
            {
              text: "基础-05-模板系统",
              link: "basic_05_templates",
            },
          ]
        },
        {
          text: "进阶指南",
          collapsible: true,
          prefix: "advanced/",
          children: [
            {
              text: "全配队通用-架构解析",
              link: "architecture",
            },
            {
              text: "如何新增角色",
              link: "add_character",
            },
          ]
        },
        {
          text: "参考手册",
          collapsible: true,
          prefix: "reference/",
          children: [
            {
              text: "状态枚举",
              link: "states_enum",
            },
            {
              text: "内置操作模板",
              link: "operation_templates",
            },
            {
              text: "内置状态处理模板",
              link: "handler_templates",
            },
            {
              text: "内置战斗配置",
              link: "battle_configs",
            },
          ]
        },
        {
          text: "实战教程",
          collapsible: true,
          prefix: "tutorial/",
          children: [
            {
              text: "朱鸢-01-确定站场角色",
              link: "zhu_yuan_01",
            },
            {
              text: "朱鸢-02-角色连招",
              link: "zhu_yuan_02",
            },
            {
              text: "朱鸢-03-连携与快速支援",
              link: "zhu_yuan_03",
            },
            {
              text: "莱特连招示例",
              link: "lighter",
            },
          ]
        },
        {
          text: "冷门知识",
          link: "other/battle_knowledge",
        }
      ]
    },
    {
      text: "贡献&开发",
      icon: "code-branch",
      prefix: "dev",
      children: [
        {
          text: "说明",
          link: "contribution",
        },
        {
          text: "路线图",
          link: "roadmap",
        }
      ]
    }
  ],
});
