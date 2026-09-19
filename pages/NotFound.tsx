import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-slate-50">
      <p className="text-primaryDark font-bold mb-3">404</p>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">페이지를 찾을 수 없습니다</h1>
      <p className="text-slate-600 mb-8 break-keep">주소를 확인하거나 서비스 안내에서 필요한 청소 서비스를 찾아주세요.</p>
      <div className="flex gap-4">
        <Link to="/" className="px-5 py-3 rounded-xl border border-slate-300 font-bold">홈으로</Link>
        <Link to="/services" className="px-5 py-3 rounded-xl bg-primaryDark text-white font-bold">서비스 안내</Link>
      </div>
    </section>
  );
}
