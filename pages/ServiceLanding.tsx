import NotFound from './NotFound';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { 
  Sparkles, CheckCircle, ShieldCheck, Clock, Star, 
  ArrowRight, Phone, Send, ChevronRight, ChevronLeft,
  Info, Check, ArrowLeft, Image as ImageIcon,
  CheckCircle2, ExternalLink, Lock, DollarSign, Calculator, TrendingUp, EyeOff, AlertTriangle, MessageCircle,
  Award, FileCheck, FileText, Building2
} from 'lucide-react';
import { m } from 'motion/react';
import { trackEvent } from '../lib/analytics';
import RecommendedPortfolioSection from '../components/RecommendedPortfolioSection';
import ServiceBeforeAfterMarquee from '../components/ServiceBeforeAfterMarquee';
import ReviewsSection from '../components/ReviewsSection';
import CeoMessageSection from '../components/CeoMessageSection';
import FAQSection from '../components/FAQSection';
import ServiceRegions from '../components/ServiceRegions';
import ServiceCaseBlogSection from '../components/ServiceCaseBlogSection';

const certificationsData = [
  { 
    id: 1, 
    title: "청소전문가 1급", 
    issuer: "한국자격검정평가진흥원",
    image: "/images/about/cert-cleaning-expert.webp" 
  },
  { 
    id: 2, 
    title: "고객상담사 1급", 
    issuer: "한국자격검정평가진흥원",
    image: "/images/about/cert-customer-service.webp" 
  },
  { 
    id: 3, 
    title: "환경관리전문가 1급", 
    issuer: "한국자격검정평가진흥원",
    image: "/images/about/cert-environment-management.webp" 
  },
  { 
    id: 4, 
    title: "방역관리사 1급", 
    issuer: "한국방역전문인협회",
    image: "/images/about/cert-pest-control.webp" 
  },
  { 
    id: 5, 
    title: "건물위생관리사 1급", 
    issuer: "한국자격검정평가진흥원",
    image: "/images/about/cert-building-hygiene.webp" 
  },
  { 
    id: 6, 
    title: "정리수납전문가 1급", 
    issuer: "한국자격검정평가진흥원",
    image: "/images/about/cert-organizing-expert.webp" 
  },
];

const ServiceLanding: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { config } = useSite();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const detailsRef = useRef<HTMLDivElement>(null);
  const beforeAfterRef = useRef<HTMLDivElement>(null);

  // Find the current service based on the URL parameter
  const service = config.services.find(s => s.id === serviceId);

  // Scroll to top when serviceId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!service) return <NotFound />;

  // Handle Formspree submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xqeqoorz", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('success');
        trackEvent('generate_lead', { method: 'contact_form', location: 'service_landing', service_type: formData.get('service_type') });
        alert('문의가 성공적으로 전달되었습니다! 기재해주신 번호로 문의 내용을 확인해 연락드리겠습니다.');
        form.reset();
        setTimeout(() => setFormStatus('idle'), 3000);
      } else {
        setFormStatus('idle');
        alert('전송에 실패했습니다. 다시 시도해 주시거나 전화(010-4880-7386)로 연락 주세요.');
      }
    } catch (error) {
      setFormStatus('idle');
      alert('네트워크 오류가 발생했습니다. 다시 시도하시거나 대표번호로 전화해 주세요.');
    }
  };

  const cleanPhone = config.companyInfo.phone.replace(/[^0-9]/g, '');

  return (
    <div className="bg-slate-50 text-slate-800 min-h-svh">
      
      {/* Dynamic Immersive Premium Hero Header */}
      <section className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] py-10 sm:py-14 md:py-18 flex items-center justify-center overflow-hidden bg-slate-950">
        
        {/* Background Responsive Image */}
        <div className="absolute inset-0 z-0">
          {/* The page's LCP element. A single <img> (not a <picture>), so
              fetchPriority="high" is safe here — the double-download issue
              only affects <img> inside <picture> (see Home.tsx). */}
          <img
            src={service.image || '/images/logo.webp'}
            alt={service.title}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-70 scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Layered Advanced Gradients & Film Grain */}
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="absolute inset-0 bg-linear-to-t/srgb from-transparent via-transparent to-slate-950/40 z-10" />
          <div className="absolute inset-0 bg-linear-to-r/srgb from-primary/10 via-transparent to-emerald-400/5" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        {/* Decorative Floating Particle Lights */}
        <div className="absolute top-0 left-0 w-full h-full opacity-15 pointer-events-none z-10">
          <div className="absolute top-1/4 left-10 w-48 h-48 bg-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-10 w-60 h-60 bg-emerald-300 rounded-full blur-[120px]" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center mt-2 sm:mt-4 md:mt-2 flex flex-col items-center justify-center">
          
          {/* Subtitle Accent */}
          <h2 className="text-slate-400 text-xs sm:text-sm sm:leading-[1.25rem] md:text-[23.25px] md:leading-[30px] font-bold tracking-tight uppercase mb-2 md:mb-4.5 break-keep leading-snug">
            상담부터 마감까지
            <br />
            대표가 책임지고 직접 관리하는
          </h2>

          {/* Main Display Title */}
          <h1 className="text-2xl sm:text-4xl sm:leading-[2.5rem] md:text-6xl md:leading-[1] font-black text-white mb-4 sm:mb-6 leading-[1.2] tracking-tight drop-shadow-2xl">
            {service.title}
          </h1>

          {/* Slogan Descriptive paragraph */}
          <div className="text-slate-200 text-sm sm:text-base sm:leading-[1.5rem] md:text-lg md:leading-[1.75rem] max-w-3xl lg:max-w-5xl mx-auto font-medium tracking-tight break-keep leading-relaxed opacity-95 px-4 flex flex-col gap-3 sm:gap-4">
            <p className="md:text-[25.25px] md:font-normal">
              {(service.heroLead || '현장 상태에 맞춰 청소 범위와 일정을 상담합니다.').split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <>{' '}<br className="hidden lg:inline" /></>}
                  {line}
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Navigation/Call to actions in Hero */}
          <div className="flex flex-wrap gap-3.5 justify-center mt-7 sm:mt-9">
            <button 
              onClick={() => beforeAfterRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-primary text-white text-sm sm:text-base font-extrabold rounded-xl hover:bg-primaryDark transition-all duration-300 shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:scale-95"
            >
              청소 사례 확인하기
            </button>
            <button 
              onClick={() => detailsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-white/10 text-white border border-white/30 backdrop-blur-md text-sm sm:text-base font-extrabold rounded-xl hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              상세 작업범위 보기
            </button>
          </div>
        </div>

        {/* Elegant Wave Subdivider */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none z-20 translate-y-[2px]">
          <svg className="relative block w-full h-8 sm:h-12 md:h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,34.58V0Z" transform="rotate(180 600 60)" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

      <div ref={beforeAfterRef}>
        <ServiceBeforeAfterMarquee serviceId={serviceId || ''} />
      </div>

      <ServiceCaseBlogSection serviceId={serviceId || ''} className="py-16 md:py-24 max-w-7xl mx-auto px-4 bg-slate-50" />

      <RecommendedPortfolioSection serviceId={serviceId || ''} />

      <ReviewsSection />

      <CeoMessageSection />

      {/* Professional Certifications Status Section (자격증 안내) */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[31.75px] md:text-5xl font-extrabold text-slate-900 mb-6">자격증 안내</h2>
            <p className="text-slate-500 text-[11px] font-bold leading-[18px] sm:text-[15px] md:text-xl md:leading-[1.75rem] sm:font-medium sm:leading-relaxed max-w-3xl mx-auto break-keep">
              자격명과 발급기관을 아래에서 확인하실 수 있습니다.<br />
              해당 작업의 적용 범위와 필요한 현장 요건은 상담에서 확인해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-8 px-1 md:px-0">
            {certificationsData.map((cert) => (
              <div key={cert.id} className="group relative">
                <div className="aspect-3/4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg group-hover:border-primary/50 group-hover:shadow-2xl transition-all duration-500">
                  <img loading="lazy" decoding="async" 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t/srgb from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-0 w-full px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                     <p className="text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wider">{cert.issuer}</p>
                  </div>
                </div>
                <div className="mt-3 md:mt-5 text-center px-1">
                  <h4 className="text-xs sm:text-base sm:leading-[1.5rem] md:text-[17px] font-bold text-slate-800 mb-1 group-hover:text-primaryDark transition-colors leading-tight break-keep">
                    {cert.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Cleaning Tile Diagnostic & Solution Section (바닥청소/왁스 전용 타일 오염 솔루션 안내) */}
      {(serviceId === 'floor' || serviceId === 'floor-wax') && (
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200 text-slate-900 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            
            {/* Main Header */}
            <div className="text-center mb-10 sm:mb-14">
              <h3 className="text-lg sm:text-3xl sm:leading-[2.5rem] md:text-[38px] md:leading-[50px] font-extrabold text-slate-900 tracking-tight leading-snug">
                <span className="block sm:inline">닦아도 닦아도 지저분해지는 이유,</span>{" "}
                <span className="block sm:inline">알고 나면 해결이 보입니다</span>
              </h3>
            </div>

            {/* Intro & Core Problem Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-10 md:mb-12 space-y-6 sm:space-y-8">
              <p className="text-slate-800 text-xs sm:text-sm sm:leading-[1.25rem] md:text-base md:leading-[1.5rem] lg:text-lg lg:leading-[1.75rem] leading-relaxed font-bold tracking-tight sm:tracking-normal">
                <span className="block sm:inline text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap sm:whitespace-normal">아무리 쓸고 닦아도 어느 순간 바닥이 얼룩지고</span>{" "}
                <span className="block sm:inline text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap sm:whitespace-normal">오염이 번져가는 현상을 겪으셨을 것입니다.</span>
              </p>
              
              <div className="p-6 sm:p-8 md:p-9 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Info className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h4 className="text-emerald-950 font-extrabold text-base sm:text-lg md:text-xl">
                    표면과 기존 코팅 상태를 함께 확인합니다.
                  </h4>
                </div>
                <p className="text-slate-800 text-xs sm:text-base sm:leading-[1.5rem] leading-relaxed font-medium space-y-0.5 sm:space-y-0">
                  <span className="block sm:inline">바닥의 표면 상태와 기존 코팅,</span>{" "}
                  <span className="block sm:inline">오염이 쌓인 기간에 따라</span>{" "}
                  <span className="block sm:inline">닦은 뒤에도 얼룩이</span>{" "}
                  <span className="block sm:inline"><strong className="text-emerald-700 underline decoration-emerald-400 decoration-2 underline-offset-4 font-bold">남을 수 있기 때문</strong>입니다.</span>{" "}
                  <span className="block sm:inline">청소 방식과 오염수 정리 상태도</span>{" "}
                  <span className="block sm:inline">함께 살펴 작업 범위를 정합니다.</span>
                </p>
              </div>
            </div>

            {/* Why Normal Cleaning Fails */}
            <div className="mb-12 md:mb-16">
              <div className="flex items-center gap-2.5 mb-6 sm:mb-8 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="text-[16.5px] leading-[22px] sm:text-2xl sm:leading-[2rem] font-extrabold text-slate-900 tracking-tight">
                  바닥 세척 전 확인할 사항은 무엇일까요?
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-emerald-300 transition-colors">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 mb-3.5">
                      원인 ①
                    </span>
                    <h5 className="text-slate-900 font-extrabold text-[15.5px] sm:text-base sm:leading-[1.5rem] md:text-lg md:leading-[1.75rem] mb-2.5 leading-snug">
                      <span className="block sm:inline whitespace-nowrap sm:whitespace-normal">오래된 오염과 자재 변색,</span>{" "}
                      <span className="block sm:inline whitespace-nowrap sm:whitespace-normal">세척과 보수를 구분해 확인</span>
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm sm:leading-[1.25rem] leading-relaxed break-keep font-normal">
                      오염이 스며든 깊이와 자재 상태에 따라 세척 후에도 자국이 남을 수 있습니다. 변색이나 손상은 보수 검토가 필요할 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-emerald-300 transition-colors">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 mb-3.5">
                      원인 ②
                    </span>
                    <h5 className="text-slate-900 font-extrabold text-[15.5px] sm:text-base sm:leading-[1.5rem] md:text-lg md:leading-[1.75rem] mb-2.5 leading-snug whitespace-nowrap sm:whitespace-normal tracking-tight sm:tracking-normal">
                      작업 구역과 오염수 정리 범위
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm sm:leading-[1.25rem] leading-relaxed break-keep font-normal">
                      바닥재와 주변 집기, 배수 여건을 확인해 세척 구역과 오염수 정리 범위를 정합니다. 모든 표면에 같은 방식을 적용하지 않습니다.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-emerald-300 transition-colors">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 mb-3.5">
                      원인 ③
                    </span>
                    <h5 className="text-slate-900 font-extrabold text-[15.5px] sm:text-base sm:leading-[1.5rem] md:text-lg md:leading-[1.75rem] mb-2.5 break-keep leading-snug">
                      세척 후 표면과 사용 일정
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm sm:leading-[1.25rem] leading-relaxed break-keep font-normal">
                      세척 후 잔여물과 수분, 남은 얼룩을 확인합니다. 통행과 집기 재배치 시점은 현장 상태를 보고 협의하며, 코팅과 연마는 별도입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </section>
      )}

      {/* Trash-house quote inputs, not unsupported price statistics. */}
      {serviceId === 'trash-house' && (
        <section className="py-16 md:py-24 bg-slate-50/80 text-slate-900 border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-4xl font-extrabold">쓰레기집 청소 견적 확인사항</h3>
              <p className="mt-4 text-slate-600 leading-relaxed break-keep">
                평수만으로 비용을 확정하지 않습니다. 사진과 현장 상태를 확인해 포함·별도 작업과 비용을 상담합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                ['적치량과 보관 물품', '쓰레기의 종류·양과 보관할 물건, 의뢰인 확인이 필요한 물품을 구분합니다. 사진에 보이지 않는 구역은 추가 확인이 필요할 수 있습니다.'],
                ['층수와 반출 동선', '계단·엘리베이터와 차량 접근, 공용공간 이용 조건을 확인합니다. 운반 범위와 인원·일정은 현장 여건에 맞춰 협의합니다.'],
                ['청소와 추가 작업', '반출 후 드러난 바닥·욕실의 오염 청소를 중심으로 견적을 냅니다. 방제·소독·탈취 가능 범위와 마감재 보수·교체는 별도로 확인합니다.'],
              ].map(([title, description]) => (
                <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-bold text-lg text-emerald-800 mb-3">{title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed break-keep">{description}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-600 leading-relaxed text-center break-keep">
              사진 상담은 예상 범위 확인을 위한 절차입니다. 방문 필요 여부와 최종 비용, 변경·취소·결제 조건은 예약 전에 확인해 주세요.
            </p>
          </div>
        </section>
      )}

      {/* Structured Detailed Job Scope Content with custom Noto Sans Layout */}
      <section ref={detailsRef} className="py-16 md:py-24 bg-slate-50/60 border-y border-slate-200/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center mb-10 sm:mb-14">
            <h3 className="text-xl sm:text-4xl sm:leading-[2.5rem] md:text-[41.5px] md:leading-[54px] font-extrabold text-slate-900 tracking-tight leading-snug">
              <span className="block sm:inline">{service.title}</span>{" "}
              <span className="block sm:inline text-emerald-700">작업 범위 및 정밀 프로세스</span>
            </h3>
            <p className="text-slate-600 text-[13px] sm:text-base sm:leading-[1.5rem] md:text-lg md:leading-[1.75rem] mt-3 font-medium leading-relaxed max-w-2xl mx-auto break-keep">
              <span className="whitespace-pre-line">{service.description}</span>
            </p>
          </div>



          {/* Work details Step Cards Grid */}
          {service.details && service.details.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {service.details.map((detail, index) => {
                const parts = detail.split(':');
                const stepNum = String(index + 1).padStart(2, '0');
                let title = '';
                let desc = detail.trim();

                if (parts.length > 1) {
                  title = parts[0].replace(/^(1|2|3|4|5|6|7|8|9|0)+단계\s*/, '').replace(/:\s*$/, '').trim();
                  desc = parts.slice(1).join(':').trim();
                }

                return (
                  <div 
                    key={index} 
                    className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400/60 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                  >
                    {/* Subtle top accent bar on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r/srgb from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/70 tracking-wider">
                          STEP {stepNum}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                          <Check className="w-4 h-4 stroke-3" />
                        </div>
                      </div>

                      {title && (
                        <h4 className="text-slate-900 font-extrabold text-base sm:text-lg md:text-xl mb-2 group-hover:text-emerald-700 transition-colors break-keep">
                          {title}
                        </h4>
                      )}
                      
                      <p className="text-slate-600 text-xs sm:text-sm sm:leading-[1.25rem] md:text-[18px] md:leading-[25px] md:font-bold leading-relaxed break-keep font-medium">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 font-medium">상세 작업 프로세스가 곧 업데이트 될 예정입니다.</p>
            </div>
          )}

          {/* Bottom Trust Guarantee Banner */}
          <div className="mt-8 sm:mt-12 bg-emerald-50/80 rounded-2xl p-5 sm:p-6 border border-emerald-200/70 text-center flex items-center justify-center gap-3 text-emerald-900 text-xs sm:text-sm font-bold break-keep">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>위 항목은 상담을 위한 작업 범위 안내입니다. 포함·제외·별도 항목은 견적 때 확정하고, 결과 확인과 보완 범위·기간도 사전에 협의합니다.</span>
          </div>

        </div>
      </section>

      {/* Main Multi-Bento Core Values Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <h3 className="text-[17px] min-[360px]:text-xl min-[410px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight whitespace-nowrap">
            상담에서 확인할 3가지 작업 기준
          </h3>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 md:p-10 rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center group cursor-default"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] min-[360px]:text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight whitespace-nowrap">현장 담당과 진행 방식 확인</h4>
            <div className="text-slate-500 text-xs sm:text-[13px] md:text-sm md:leading-[1.25rem] leading-relaxed font-semibold text-center space-y-4">
              <p>
                방문 담당자와 작업 구역,<br />
                출입 조건을 먼저 확인합니다.
              </p>
              <p>
                청소 중 확인할 사항과<br />
                결과 확인 방식을 협의합니다.
              </p>
              <p>
                현장 제약과 요청사항을 확인해<br />
                진행 범위를 안내합니다.
              </p>
            </div>
          </m.div>

          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 md:p-10 rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center group cursor-default"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Star className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] min-[360px]:text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight whitespace-nowrap">포함·별도 항목을 나눈 견적</h4>
            <div className="text-slate-500 text-xs sm:text-[13px] md:text-sm md:leading-[1.25rem] leading-relaxed font-semibold text-center space-y-4">
              <p>
                청소 구역과 선택 작업을<br />
                견적에서 구분해 확인합니다.
              </p>
              <p>
                현장을 직접 확인하고<br />
                작업 범위와 단가를 근거로 제시
              </p>
              <p>
                투명하게 금액을 공개하고<br />
                고객님께 견적을 안내합니다.
              </p>
            </div>
          </m.div>

          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.19 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 md:p-10 rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center group cursor-default"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] min-[360px]:text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight whitespace-nowrap">결과 확인과 보완 범위 협의</h4>
            <div className="text-slate-500 text-xs sm:text-[13px] md:text-sm md:leading-[1.25rem] leading-relaxed font-semibold text-center space-y-4">
              <p>
                합의한 작업 내역을 기준으로<br />
                결과 확인 방식을 정합니다.
              </p>
              <p>
                남은 오염과 자재 손상을<br />
                구분해 안내하고,
              </p>
              <p>
                보완 대상과 기간은 사전에 확인합니다.
              </p>
            </div>
          </m.div>

        </div>
      </section>

      <FAQSection key={service.id} serviceId={service.id} ctaPhone={cleanPhone} />
      <ServiceRegions serviceId={service.id} serviceTitle={service.title} />

      {/* Embedded Real, Seamless Consultation Contact Formspree Area (No placeholders) */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          
          <m.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 rounded-4xl border border-white/10 shadow-xl shadow-black/20 p-6 sm:p-12 md:p-16 relative"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="text-center mb-10">
              <h3 className="text-xl sm:text-3xl sm:leading-[2.5rem] font-extrabold text-white tracking-tight mb-2 leading-tight">
                {service.title}
                <br />
                견적 상담 신청
              </h3>
              <p className="text-slate-300 text-[11.5px] xs:text-[13.5px] sm:text-base md:text-[18px] font-bold leading-normal xs:leading-relaxed sm:leading-loose break-keep px-2 sm:px-4 opacity-95">
                현장 위치와 희망 범위를 접수해 주시면,<br />
                작업 가능 범위와 일정을 확인해<br />
                친절하게 안내드리겠습니다
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10 text-left">
              {/* Invisible hidden parameters to pass the actual service context to Formspree */}
              <input type="hidden" name="service_type" value={`${service.title} (개별랜딩 특별견적)`} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                   <label htmlFor="service-quote-name" className="block text-xs sm:text-sm font-bold text-white mb-2 font-black">성함 또는 단체명 <span className="text-red-500 font-bold">*</span></label>
                  <input id="service-quote-name" name="name" required type="text" className="w-full px-4.5 py-3 sm:py-4 text-xs sm:text-base rounded-xl border border-slate-700 focus:ring-2 focus:ring-slate-400 focus:border-slate-500 outline-hidden transition bg-white text-slate-900 placeholder-slate-400" placeholder="성함 기재" />
                </div>
                <div>
                   <label htmlFor="service-quote-phone" className="block text-xs sm:text-sm font-bold text-white mb-2 font-black">연락처 <span className="text-red-500 font-bold">*</span></label>
                  <input id="service-quote-phone" name="phone" required type="tel" className="w-full px-4.5 py-3 sm:py-4 text-xs sm:text-base rounded-xl border border-slate-700 focus:ring-2 focus:ring-slate-400 focus:border-slate-500 outline-hidden transition bg-white text-slate-900 placeholder-slate-400" placeholder="예: 010-0000-0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                   <label htmlFor="service-quote-date" className="block text-xs sm:text-sm font-bold text-white mb-2 font-black">시공 예정일 (희망 일정)</label>
                  <input id="service-quote-date" name="date" type="text" className="w-full px-4.5 py-3 sm:py-4 text-xs sm:text-base rounded-xl border border-slate-700 focus:ring-2 focus:ring-slate-400 focus:border-slate-500 outline-hidden transition bg-white text-slate-900 placeholder-slate-400" placeholder="예: 11월 중순 또는 일정 협의" />
                </div>
                <div>
                   <label htmlFor="service-quote-area_size" className="block text-xs sm:text-sm font-bold text-white mb-2 font-black">현장 위치 / 예상 평수</label>
                  <input id="service-quote-area_size" name="area_size" type="text" className="w-full px-4.5 py-3 sm:py-4 text-xs sm:text-base rounded-xl border border-slate-700 focus:ring-2 focus:ring-slate-400 focus:border-slate-500 outline-hidden transition bg-white text-slate-900 placeholder-slate-400" placeholder="예: 군포 도마교동 / 25평" />
                </div>
              </div>

              <div>
                 <label htmlFor="service-quote-message" className="block text-xs sm:text-sm font-bold text-white mb-2">추가 문의 및 현장 요청사항 <span className="text-red-500 font-bold">*</span></label>
                <textarea id="service-quote-message"
                  name="message" 
                  required 
                  rows={4} 
                  className="w-full px-4.5 py-3.5 text-xs sm:text-base sm:leading-[1.5rem] rounded-xl border border-slate-700 focus:ring-2 focus:ring-white/20 focus:border-white outline-hidden transition bg-white text-slate-900 placeholder-slate-400 resize-none leading-relaxed"
                  placeholder="예: 실리콘 그을음 제거 필수, 인테리어 수납 마감 먼지 케어 요청, 찌든기름때 제거 등 희망하시는 세심한 요구조건을 자유롭게 적어주세요."
                ></textarea>
              </div>

              <div className="flex items-start gap-2.5">
                <input id="privacy-consent-service" name="privacy_consent" type="checkbox" required className="mt-1 w-4 h-4 accent-primary shrink-0" />
                <label htmlFor="privacy-consent-service" className="text-xs md:text-sm md:leading-[1.25rem] text-slate-300 leading-relaxed break-keep">
                  (필수) 견적 상담을 위한 개인정보 수집·이용에 동의합니다.{' '}
                  <Link to="/privacy" target="_blank" rel="noreferrer" className="underline text-slate-200 hover:text-primary">개인정보처리방침 보기</Link>
                </label>
              </div>

              <div className="pt-2">
                <m.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={formStatus === 'submitting'}
                  type="submit"
                  className="w-full bg-primary text-white text-[15px] xs:text-[16px] sm:text-xl md:text-[22px] font-black py-4 sm:py-[22px] md:py-[24px] px-4 rounded-xl sm:rounded-2xl hover:bg-[#1fa178] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:bg-slate-700 disabled:text-slate-500 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/45 whitespace-nowrap"
                >
                  {formStatus === 'submitting' ? (
                     <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        작업전송 처리중...
                     </span>
                  ) : (
                     <>상세 견적 상담 신청 및 문의 전송 <Send className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" /></>
                  )}
                </m.button>
              </div>
            </form>
          </m.div>

          <div className="text-center mt-12 mb-4">
            <Link to="/services" className="inline-flex items-center gap-2 text-slate-800 hover:text-primary transition-all font-extrabold text-base sm:text-lg md:text-[21px] border-b-2 border-slate-300/60 hover:border-primary pb-1">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" /> 다른 청소 전체 서비스 둘러보기
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ServiceLanding;
