'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { ContactInfo } from "@/lib/types/content";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // 获取联系页面信息
  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await fetch('/api/contact-info');
        const result = await response.json();
        if (result.success) {
          setContactInfo(result.data);
        }
      } catch (error) {
        console.error('Failed to load contact info:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContactInfo();
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // 清除提交状态
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    } else if (formData.name.length > 50) {
      newErrors.name = '姓名不能超过50个字符';
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!formData.message.trim()) {
      newErrors.message = '消息内容不能为空';
    } else if (formData.message.length < 10) {
      newErrors.message = '消息内容至少10个字符';
    } else if (formData.message.length > 2000) {
      newErrors.message = '消息内容不能超过2000个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('提交成功！我会尽快回复你的消息。');
        // 清空表单
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error?.message || '提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      setSubmitStatus('error');
      setSubmitMessage('网络错误，请检查网络连接后重试');
    } finally {
      setIsSubmitting(false);
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

  if (!contactInfo) {
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
          {contactInfo.page.title}
        </h1>
        <p className="text-[var(--text-muted)]">{contactInfo.page.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">{contactInfo.info.title}</h3>
          <p className="text-[14px] text-[var(--text-muted)]">{contactInfo.info.description}</p>
          <hr className="my-[18px] border-t border-[var(--border)]" />
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)] text-[14px]">
            <b>邮箱</b>：{contactInfo.info.contacts.email}<br/>
            <b>GitHub</b>：{contactInfo.info.contacts.github}<br/>
            <b>微信</b>：{contactInfo.info.contacts.wechat}
          </div>
        </div>

        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">发送消息</h3>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2 text-[14px]">
              <label>姓名</label>
              <Input
                placeholder="你的姓名"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="text-red-500 text-[12px]">{errors.name}</span>
              )}
            </div>
            <div className="grid gap-2 text-[14px]">
              <label>邮箱</label>
              <Input
                type="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="text-red-500 text-[12px]">{errors.email}</span>
              )}
            </div>
            <div className="grid gap-2 text-[14px]">
              <label>信息</label>
              <Textarea
                placeholder="你想聊的内容：岗位/项目/合作…"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                disabled={isSubmitting}
                rows={5}
              />
              {errors.message && (
                <span className="text-red-500 text-[12px]">{errors.message}</span>
              )}
            </div>

            {/* 提交状态提示 */}
            {submitStatus !== 'idle' && (
              <div
                className={`p-3 rounded-[var(--radius-md)] text-[14px] ${
                  submitStatus === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {submitMessage}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交'}
              </Button>
              <Button variant="default" type="button" asChild>
                <Link href="/projects">先看看项目</Link>
              </Button>
            </div>
            <div className="text-[13px] text-[var(--text-muted)]">
              {contactInfo.form.submitHint}
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
