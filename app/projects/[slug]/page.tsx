import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "项目详情 | Allen Lu",
  description: "智能仓储数字孪生平台项目详情",
};

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Container className="pb-[64px]">
      <div className="py-[40px] pb-[24px]">
        <div className="flex gap-2 items-center text-[13px] text-[var(--text-muted)] mb-2">
          <Link href="/projects" className="hover:underline">项目</Link>
          <span>›</span>
          <span>智能仓储数字孪生平台</span>
        </div>
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">智能仓储数字孪生平台</h1>
        <p className="text-[var(--text-muted)]">三维场景 + 实时数据联动，支持设备状态与货物流转动画，强调性能与工程化。</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Tag>Three.js</Tag>
          <Tag>WebGL</Tag>
          <Tag>MQTT/WebSocket</Tag>
          <Tag>性能优化</Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-[32px] items-start mb-8">
        <div>
          <div className="border border-dashed border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-muted)] to-white rounded-[var(--radius-lg)] h-[280px] grid place-items-center text-[var(--text-muted)] mb-6">
            主视觉（大图/视频占位）
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[var(--border)] rounded-[var(--radius-md)] p-4 bg-[var(--bg)]">
              <strong className="block text-[18px] mb-1">FPS +15</strong>
              <span className="text-[12px] text-[var(--text-muted)]">关键场景优化</span>
            </div>
            <div className="border border-[var(--border)] rounded-[var(--radius-md)] p-4 bg-[var(--bg)]">
              <strong className="block text-[18px] mb-1">首屏 -30%</strong>
              <span className="text-[12px] text-[var(--text-muted)]">资源与渲染策略</span>
            </div>
            <div className="border border-[var(--border)] rounded-[var(--radius-md)] p-4 bg-[var(--bg)]">
              <strong className="block text-[18px] mb-1">稳定运行</strong>
              <span className="text-[12px] text-[var(--text-muted)]">长时监控场景</span>
            </div>
          </div>
        </div>

        <aside className="border border-[var(--border)] rounded-[var(--radius-md)] p-5 bg-[var(--bg)]">
          <h3 className="text-[16px] font-bold mb-3">概览</h3>
          <div className="grid gap-[10px] text-[14px]">
            <div className="grid grid-cols-[90px_1fr] gap-[10px]">
              <b className="text-[var(--text-muted)] font-semibold">角色</b>
              <span>前端负责人 / 独立交付</span>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-[10px]">
              <b className="text-[var(--text-muted)] font-semibold">周期</b>
              <span>2024.01 - 2024.06</span>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-[10px]">
              <b className="text-[var(--text-muted)] font-semibold">技术栈</b>
              <span>Next.js / Three.js / TS / WebSocket</span>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-[10px]">
              <b className="text-[var(--text-muted)] font-semibold">链接</b>
              <span>
                <a href="#" className="hover:underline">Demo</a> · <a href="#" className="hover:underline">GitHub</a> · <a href="#" className="hover:underline">文章</a>
              </span>
            </div>
          </div>
          <hr className="my-[18px] border-t border-[var(--border)]" />
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)] text-[var(--text-muted)] text-[14px]">
            提示：这里是面试“讲项目”的脚本入口。每个模块都按“问题→方案→结果”组织。
          </div>
        </aside>
      </div>

      <hr className="border-t border-[var(--border)]" />

      <Section>
        <h2 className="text-[28px] font-bold mb-[12px]">背景与目标</h2>
        <p className="text-[var(--text-muted)]">为什么做？用户是谁？业务要解决什么？成功指标是什么？（占位文本）</p>
      </Section>

      <hr className="border-t border-[var(--border)]" />

      <Section>
        <h2 className="text-[28px] font-bold mb-[12px]">我的职责</h2>
        <ul className="list-disc pl-5 text-[var(--text-muted)] space-y-1">
          <li>搭建三维场景结构（场景/相机/光照/控制器）</li>
          <li>实时数据接入与状态映射（设备状态/动画/告警）</li>
          <li>性能优化：渲染、资源加载、对象管理</li>
          <li>组件化沉淀：相机控制、拾取高亮、标注系统</li>
        </ul>
      </Section>

      <hr className="border-t border-[var(--border)]" />

      <Section>
        <h2 className="text-[28px] font-bold mb-[12px]">技术方案</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">架构模块</h3>
            <p className="text-[14px] text-[var(--text-muted)]">Scene Core / Data Layer / Interaction / UI Layer / Asset Pipeline（占位）</p>
          </div>
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">数据流</h3>
            <p className="text-[14px] text-[var(--text-muted)]">MQTT/WebSocket → 状态归一化 → 渲染映射 → UI 展示（占位）</p>
          </div>
        </div>
      </Section>

      <hr className="border-t border-[var(--border)]" />

      <Section>
        <h2 className="text-[28px] font-bold mb-[12px]">难点与解决</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">难点 1：性能瓶颈</h3>
            <p className="text-[14px] text-[var(--text-muted)]">方案：实例化/裁剪/LOD/合批策略（占位）</p>
          </div>
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">难点 2：交互复杂</h3>
            <p className="text-[14px] text-[var(--text-muted)]">方案：拾取、hover/选中态、事件分层（占位）</p>
          </div>
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">难点 3：实时数据抖动</h3>
            <p className="text-[14px] text-[var(--text-muted)]">方案：节流、插值、状态机、队列（占位）</p>
          </div>
        </div>
      </Section>

      <hr className="border-t border-[var(--border)]" />

      <Section>
        <h2 className="text-[28px] font-bold mb-[12px]">截图集</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-dashed border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-muted)] to-white rounded-[var(--radius-lg)] h-[200px] grid place-items-center text-[var(--text-muted)]">
              截图 {i}
            </div>
          ))}
        </div>
      </Section>

      <hr className="border-t border-[var(--border)]" />

      <div className="flex justify-between gap-3 flex-wrap mt-[48px]">
        <Button variant="outline" asChild>
          <Link href="/projects">返回项目列表</Link>
        </Button>
        <Button variant="primary" asChild>
          <Link href="/contact">对这个项目感兴趣？联系我</Link>
        </Button>
      </div>
    </Container>
  );
}
