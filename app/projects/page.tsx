import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata = {
  title: "项目 | Allen Lu",
  description: "Allen Lu 的项目作品集",
};

export default function ProjectsPage() {
  return (
    <Container className="pb-[48px]">
      <div className="py-[40px] pb-[24px]">
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">项目</h1>
        <p className="text-[var(--text-muted)]">按方向筛选项目，点击进入详情页查看“难点 → 方案 → 结果”。</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg)] mb-[24px]">
        <Button variant="default">全部</Button>
        <Button variant="ghost">数字孪生</Button>
        <Button variant="ghost">可视化</Button>
        <Button variant="ghost">AI 应用</Button>
        <Input className="max-w-[300px]" placeholder="搜索：项目名 / 技术栈 / 关键词" />
        <span className="ml-auto text-[14px] text-[var(--text-muted)]">共 6 个项目（占位）</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProjectCard
            key={i}
            href={`/projects/project-${i}`}
            title={`项目 ${i}：示例标题`}
            description="一句话成果导向描述：解决了什么问题，带来什么效果。"
            tags={["Three.js", "TypeScript", "性能"]}
          />
        ))}
      </div>
    </Container>
  );
}
