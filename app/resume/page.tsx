'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ResumeContent } from "@/lib/types/content";

export default function ResumePage() {
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResumeContent() {
      try {
        const response = await fetch('/api/resume');
        const result = await response.json();
        if (result.success) {
          setResumeContent(result.data);
        }
      } catch (error) {
        console.error('Failed to load resume content:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResumeContent();
  }, []);

  const handleDownloadPDF = () => {
    window.open(resumeContent?.download.pdfUrl || '/api/resume/download', '_blank');
  };

  const handleCopyEmail = () => {
    if (navigator.clipboard && resumeContent) {
      navigator.clipboard.writeText(resumeContent.download.email);
      alert('已复制邮箱');
    }
  };

  if (isLoading) {
    return (
      <Container className="pb-[64px]">
        <div className="py-[40px] text-center text-[var(--text-muted)]">
          <p>加载中...</p>
        </div>
      </Container>
    );
  }

  if (!resumeContent) {
    return (
      <Container className="pb-[64px]">
        <div className="py-[40px] text-center text-[var(--text-muted)]">
          <p>加载失败，请刷新页面重试</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-[64px]">
      <div className="py-[40px] pb-[24px]">
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">
          {resumeContent.page.title}
        </h1>
        <p className="text-[var(--text-muted)]">{resumeContent.page.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">{resumeContent.summary.title}</h3>
          <ul className="list-disc pl-[18px] text-[var(--text-muted)] space-y-1 mb-4">
            {resumeContent.summary.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="flex gap-3 flex-wrap mt-4">
            <Button variant="primary" onClick={handleDownloadPDF}>
              下载 PDF
            </Button>
            <Button variant="default" onClick={handleCopyEmail}>
              复制邮箱
            </Button>
          </div>
        </div>
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">简历预览位</h3>
          <div className="border border-dashed border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-muted)] to-white rounded-[var(--radius-lg)] h-[340px] grid place-items-center text-[var(--text-muted)]">
            {resumeContent.preview.placeholder}
          </div>
        </div>
      </div>
    </Container>
  );
}
