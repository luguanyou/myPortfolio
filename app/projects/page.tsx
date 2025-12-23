import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProjects } from "@/lib/api/data";

export const metadata = {
  title: "项目 | Allen Lu",
  description: "Allen Lu 的项目作品集",
};

export default async function ProjectsPage() {
  let projects;
  
  try {
    projects = await getProjects();
  } catch (error) {
    console.error('Failed to load projects:', error);
    return (
      <Container className="pb-[48px]">
        <div className="py-[40px] text-center text-[var(--text-muted)]">
          <p>加载失败，请刷新页面重试</p>
        </div>
      </Container>
    );
  }

  // 获取分类列表（从项目中提取唯一分类）
  const categories = ['全部', ...Array.from(new Set(projects.map(p => p.category)))];

  return (
    <Container className="pb-[48px]">
      <div className="py-[40px] pb-[24px]">
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">项目</h1>
        <p className="text-[var(--text-muted)]">按方向筛选项目，点击进入详情页查看"难点 → 方案 → 结果"。</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg)] mb-[24px]">
        {categories.map((category) => (
          <Button key={category} variant={category === '全部' ? 'default' : 'ghost'}>
            {category}
          </Button>
        ))}
        <Input className="max-w-[300px]" placeholder="搜索：项目名 / 技术栈 / 关键词" />
        <span className="ml-auto text-[14px] text-[var(--text-muted)]">共 {projects.length} 个项目</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            href={`/projects/${project.slug}`}
            title={project.title}
            description={project.description}
            tags={project.tags}
          />
        ))}
      </div>
    </Container>
  );
}
