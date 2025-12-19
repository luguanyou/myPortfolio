'use client';

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";

export default function ContactPage() {
  return (
    <Container className="pb-[64px]">
      <div className="py-[40px] pb-[24px]">
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">联系</h1>
        <p className="text-[var(--text-muted)]">留下你的需求/岗位信息，我会尽快回复。（原型阶段不接真实接口）</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">联系方式</h3>
          <p className="text-[14px] text-[var(--text-muted)]">邮箱、GitHub、社交链接放这里。也可以加“可工作城市/到岗时间”。</p>
          <hr className="my-[18px] border-t border-[var(--border)]" />
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)] text-[14px]">
            <b>邮箱</b>：you@example.com<br/>
            <b>GitHub</b>：github.com/yourname<br/>
            <b>微信</b>：yourwechat
          </div>
        </div>

        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">发送消息</h3>
          <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); alert('原型阶段：已模拟提交 ✅'); }}>
            <div className="grid gap-2 text-[14px]">
              <label>姓名</label>
              <Input placeholder="你的姓名" />
            </div>
            <div className="grid gap-2 text-[14px]">
              <label>邮箱</label>
              <Input placeholder="name@email.com" />
            </div>
            <div className="grid gap-2 text-[14px]">
              <label>信息</label>
              <Textarea placeholder="你想聊的内容：岗位/项目/合作…" />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary" type="submit">提交</Button>
              <Button variant="default" type="button" asChild>
                <Link href="/projects">先看看项目</Link>
              </Button>
            </div>
            <div className="text-[13px] text-[var(--text-muted)]">
              后续接入：邮件发送 / 数据库存储 / 防刷（rate limit）
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
