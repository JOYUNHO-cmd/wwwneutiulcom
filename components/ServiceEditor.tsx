import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { updateServiceDoc } from '../lib/firebaseService';
import { mergeServiceOverrides, serviceEditPayload } from '../lib/serviceOverrides.mjs';
import ImageUploader from './ImageUploader';

const ServiceEditor: React.FC = () => {
  const { config, updateConfig } = useSite();
  const [selectedId, setSelectedId] = useState(config.services[0]?.id || '');
  const selected = config.services.find(service => service.id === selectedId);
  const [form, setForm] = useState({ title: selected?.title || '', description: selected?.description || '', details: selected?.details.join('\n') || '', image: selected?.image || '' });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selected && !dirty) setForm({ title: selected.title, description: selected.description, details: selected.details.join('\n'), image: selected.image });
  }, [selected, dirty]);

  const change = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setDirty(true);
    setMessage('');
    setError('');
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = serviceEditPayload({ ...form, details: form.details.split('\n').map(line => line.trim()).filter(Boolean) });
      await updateServiceDoc(selectedId, payload);
      updateConfig({ services: mergeServiceOverrides(config.services, [{ id: selectedId, ...payload }]) });
      setDirty(false);
      setMessage('저장했습니다. 공개 서비스 페이지를 새로 열면 반영된 내용을 확인할 수 있습니다.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '저장하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white rounded-2xl shadow-xs p-4 md:p-8 space-y-6 border border-gray-100">
      <div>
        <label htmlFor="service-select" className="block text-sm font-bold text-gray-700 mb-2">수정할 서비스</label>
        <select id="service-select" value={selectedId} disabled={saving} onChange={event => {
          if (dirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 다른 서비스로 이동하시겠습니까?')) return;
          setDirty(false); setSelectedId(event.target.value); setMessage(''); setError('');
        }} className="w-full border border-gray-200 rounded-xl px-4 py-3">
          {config.services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}
        </select>
        <p className="text-xs text-gray-500 mt-2">서비스 목록과 상세 페이지의 제목, 소개, 작업 항목, 대표 이미지를 수정합니다.</p>
      </div>
      <fieldset disabled={saving} className="space-y-6 disabled:opacity-60">
        <div>
          <label htmlFor="service-title" className="block text-sm font-bold text-gray-700 mb-2">서비스 제목</label>
          <input id="service-title" required maxLength={200} value={form.title} onChange={event => change('title', event.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3" />
        </div>
        <div>
          <label htmlFor="service-description" className="block text-sm font-bold text-gray-700 mb-2">서비스 소개</label>
          <textarea id="service-description" rows={6} maxLength={5000} value={form.description} onChange={event => change('description', event.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3" />
        </div>
        <div>
          <label htmlFor="service-details" className="block text-sm font-bold text-gray-700 mb-2">주요 작업 항목 (한 줄에 하나, 최대 30개)</label>
          <textarea id="service-details" rows={7} value={form.details} onChange={event => change('details', event.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3" />
        </div>
        <ImageUploader id="service-image" label="대표 이미지" value={form.image} onChange={value => change('image', value)} />
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
      <button type="submit" disabled={saving || !selected} className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {saving ? '저장 중...' : '서비스 저장'}
      </button>
    </form>
  );
};

export default ServiceEditor;
