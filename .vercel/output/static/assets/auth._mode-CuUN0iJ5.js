import{c as U,s as f,cY as je,u as le,b as ye,a as Ne,r as x,cZ as _e,S as ie,bC as ke,bB as qe,aW as Se,j as e,I as A,U as Pe,a8 as se,c6 as de,X as ce,aN as ze,O as Ce,as as Ee,J as D,cT as Te,a5 as Ie,d as Q,ba as $e,aQ as q,ck as Le,n as De,c_ as re,e as Ae,A as i}from"./index-BQI9LEc1.js";import{C as Me}from"./compass-BDwcwcTL.js";import{E as Re}from"./eye-off-CTaEpMY5.js";import{L as te}from"./lock-BjhGJD6g.js";const We=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],Fe=U("facebook",We);const Ge=[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]],Oe=U("instagram",Ge);const Ye=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],Ue=U("twitter",Ye);const Ze=[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]],Be=U("youtube",Ze);async function ne(s){const{data:a}=await f.from("user_roles").select("role").eq("user_id",s.id),n=(a??[]).map(C=>C.role)[0]||"customer",[{data:r},{data:u}]=await Promise.all([f.from("profiles").select("phone, full_name, address_text").eq("id",s.id).maybeSingle(),f.from("user_addresses").select("address_text").eq("user_id",s.id).eq("is_default",!0).maybeSingle()]),h=r?.phone&&r.phone.trim()!=="",b=r?.full_name&&r.full_name.trim()!=="",y=!!(r?.address_text?.trim()||u?.address_text?.trim());return n==="admin"?{url:"/admin",needsCompletion:!1,role:n}:n==="delivery_company"?!b||!h||!y?{url:"/delivery/complete",needsCompletion:!0,role:n}:{url:"/delivery/dashboard",needsCompletion:!1,role:n}:n==="distributor"?{url:"/distributor/dashboard",needsCompletion:!1,role:n}:n==="seller"?{url:"/dashboard",needsCompletion:!1,role:n}:{url:"/",needsCompletion:!1,role:n}}function oe(s){return`sy${s.replace(/[^0-9]/g,"")}@souqi.local`}function J(s){const a=s.replace(/[\s\-\(\)]/g,"");if(!/^[0-9+]+$/.test(a))return{valid:!1,message:"⚠️ الرقم يجب أن يحتوي على أرقام فقط"};const o=a.replace(/[^0-9]/g,"");let n=!1,r="";return a.startsWith("+963")?o.length===12&&(r=o.slice(-9),n=r.startsWith("9")):a.startsWith("00963")?o.length===14&&(r=o.slice(-9),n=r.startsWith("9")):a.startsWith("0")?o.length===10&&(r=o.slice(1),n=r.startsWith("9")):o.length===9&&(r=o,n=r.startsWith("9")),n?{valid:!0}:{valid:!1,message:"⚠️ صيغة الرقم غير صحيحة. استخدم: +963xxxxxxxxx أو 0xxxxxxxxx (يبدأ بـ 9)"}}async function He(s){if(!s||s.trim().length<5)return{available:!1,message:"رقم الهاتف غير صحيح (يجب أن يكون 5 أرقام على الأقل)"};const a=J(s);if(!a.valid)return{available:!1,message:a.message||"⚠️ صيغة الرقم غير صحيحة"};const{data:o,error:n}=await f.from("profiles").select("id, phone").eq("phone",s.trim()).maybeSingle();return n?(console.error("Error checking phone:",n),{available:!1,message:"حدث خطأ في التحقق من الرقم"}):o?{available:!1,message:"⚠️ هذا الرقم مستخدم من قبل حساب آخر"}:{available:!0}}async function xe(s,a,o){try{if(a&&o){const{data:r}=await f.from("governorates").select("*");if(r){for(const u of r)if(u.center_lat&&u.center_lng&&Math.sqrt(Math.pow(a-u.center_lat,2)+Math.pow(o-u.center_lng,2))<.5)return{governorate_id:u.id,governorate_name:u.name_ar}}}if(s){const{data:r}=await f.from("governorates").select("*");if(r){for(const u of r)if(s.includes(u.name_ar)||s.includes(u.name_en||""))return{governorate_id:u.id,governorate_name:u.name_ar}}}const{data:n}=await f.from("governorates").select("id, name_ar").eq("name_ar","دمشق").single();return n?{governorate_id:n.id,governorate_name:n.name_ar}:{governorate_id:"",governorate_name:""}}catch(n){return console.error("Error extracting governorate:",n),{governorate_id:"",governorate_name:""}}}async function Xe(s,a){try{const{governorate_id:o,governorate_name:n}=await xe(a.address,a.lat,a.lng);console.log("📍 Extracted governorate:",n,"ID:",o);const r={user_id:s,label:a.label||"الرئيسي",address_text:a.address.trim(),details:a.details?.trim()||"",lat:a.lat||0,lng:a.lng||0,governorate_id:o||null,is_default:!0},{data:u}=await f.from("user_addresses").select("id").eq("user_id",s).maybeSingle();if(u?.id){const{error:b}=await f.from("user_addresses").update(r).eq("id",u.id);if(b)throw b}else{const{error:b}=await f.from("user_addresses").insert(r);if(b)throw b}const{error:h}=await f.from("profiles").update({lat:a.lat||0,lng:a.lng||0,address_text:a.address.trim(),governorate_id:o||null}).eq("id",s);if(h)throw console.error("❌ Error updating profile:",h),h;return console.log("✅ Address saved with governorate:",n),{success:!0}}catch(o){return console.error("❌ Error saving address:",o),{success:!1,error:o.message}}}function V({label:s,icon:a,children:o}){return e.jsxs("div",{children:[e.jsxs(D,{className:"flex items-center gap-2 text-xs font-bold text-white/90",children:[e.jsx("span",{className:"h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]"}),s]}),e.jsxs("div",{className:"relative mt-1.5",children:[e.jsx("span",{className:"absolute inset-y-0 start-3 z-10 my-auto h-4 w-4 text-[#f9a8d4]",children:a}),e.jsx("div",{className:"[&_input]:h-12 [&_input]:rounded-2xl [&_input]:border-0 [&_input]:bg-white/[.97] [&_input]:ps-9 [&_input]:text-slate-800 [&_input]:placeholder:text-slate-400 [&_input]:shadow-[0_4px_20px_rgba(0,0,0,.08)] [&_input]:focus:ring-2 [&_input]:focus:ring-[#f9a8d4]/50",children:o})]})]})}const Ve=[{arTitle:"كل ذوق… إله مكان.",arText:"اكتشف متاجر ومنتجات بتشبهك، وخلي اختيارك يحكي عنك.",enTitle:"Every taste has a place.",enText:"Discover stores and products that feel like you.",icon:Me,accent:"pink"},{arTitle:"مو بس تسوّق…",arText:"اختار. اكتشف. واستمتع بتجربة معمولة على ذوقك.",enTitle:"More than shopping.",enText:"Discover. Choose. Enjoy a shopping experience made for you.",icon:ie,accent:"olive"},{arTitle:"الاختيار إلو ذوق.",arText:"ومن هون… بيبدأ الاختيار الصح.",enTitle:"Choice has a taste.",enText:"And this is where the right choice begins.",icon:ke,accent:"pink"},{arTitle:"اللي بتدور عليه… أقرب مما تتخيّل.",arText:"مكان واحد، آلاف الخيارات، وذوقك هو البداية.",enTitle:"What you want is closer than you think.",enText:"One place. Endless choices. Your taste leads the way.",icon:qe,accent:"olive"},{arTitle:"خلّي ذوقك يحكي.",arText:"تسوّق بطريقتك. اختار بطريقتك. وكن أنت.",enTitle:"Let your taste speak.",enText:"Shop your way. Choose your way. Be you.",icon:Se,accent:"pink"}];function sa(){const{mode:s}=je.useParams(),a=le(),o=ye(),n=Ne(),[r,u]=x.useState(""),[h,b]=x.useState(""),[y,C]=x.useState(""),[p,Z]=x.useState(null),[M,c]=x.useState(!1),[z,B]=x.useState(!1),[H,S]=x.useState(0),[E,O]=x.useState(!1),[v,T]=x.useState(null),[P,I]=x.useState(null),[N,R]=x.useState(""),[$,W]=x.useState(!1);x.useEffect(()=>{const l=setInterval(()=>{S(t=>(t+1)%5)},5e3);return()=>clearInterval(l)},[]),x.useEffect(()=>{let l=!0,t=null;return t=setTimeout(async()=>{try{const{data:{session:m}}=await f.auth.getSession();if(!l)return;if(m?.user){const{data:w}=await f.from("user_roles").select("role").eq("user_id",m.user.id),g=w?.map(k=>k.role)||[];let j="/";g.includes("admin")?j="/admin":g.includes("delivery_company")?j="/delivery/dashboard":g.includes("distributor")?j="/distributor/dashboard":g.includes("seller")&&(j="/dashboard"),window.location.replace(j)}}catch(m){console.error("Session check error:",m)}},150),()=>{l=!1,t&&clearTimeout(t)}},[]);const F=s==="login",_=s==="register";x.useEffect(()=>{if(!_)return;const t=setTimeout(async()=>{const d=r.trim();if(d.length<5){T(null),I(null);return}O(!0);try{const m=await He(d);I(m.available),T(m.available?null:m.message||null)}catch(m){console.error("Error checking phone:",m),T("حدث خطأ في التحقق من الرقم"),I(!1)}finally{O(!1)}},500);return()=>clearTimeout(t)},[r,_]),x.useEffect(()=>{(async()=>{if(!p){R("");return}W(!0);try{const t=await xe(p.address,p.lat,p.lng);R(t.governorate_name)}catch(t){console.error("Error extracting governorate:",t)}finally{W(!1)}})()},[p]);function ue(){n({to:"/reset-password"})}function X(l){const t=l?.message||String(l),d=a.lang==="ar"?"ar":"en",m={"Invalid login credentials":{ar:"❌ رقم الهاتف أو كلمة المرور غير صحيحة",en:"❌ Invalid phone number or password"},"Email not confirmed":{ar:"⚠️ البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني",en:"⚠️ Email not confirmed. Please check your email"},"User not found":{ar:"❌ لا يوجد حساب بهذا الرقم",en:"❌ No account found with this number"},"Invalid password":{ar:"❌ كلمة المرور غير صحيحة",en:"❌ Invalid password"},"Too many requests":{ar:"⚠️ عدد كبير من المحاولات. يرجى المحاولة لاحقاً",en:"⚠️ Too many attempts. Please try again later"}};for(const[w,g]of Object.entries(m))if(t.toLowerCase().includes(w.toLowerCase()))return g[d];return t.includes("phone")||t.includes("رقم")?d==="ar"?"❌ رقم الهاتف غير صحيح":"❌ Invalid phone number":t.includes("password")||t.includes("كلمة المرور")?d==="ar"?"❌ كلمة المرور غير صحيحة":"❌ Invalid password":d==="ar"?`❌ حدث خطأ: ${t}`:`❌ Error: ${t}`}function K(l){const t=l?.message||String(l),d=a.lang==="ar"?"ar":"en",m={"User already registered":{ar:"⚠️ هذا الرقم مسجل مسبقاً. يرجى تسجيل الدخول",en:"⚠️ This number is already registered. Please login"},"Password should be at least 6 characters":{ar:"❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل",en:"❌ Password must be at least 6 characters"},"Email already in use":{ar:"⚠️ هذا الرقم مستخدم من قبل حساب آخر",en:"⚠️ This number is already in use"},"Network error":{ar:"⚠️ خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت",en:"⚠️ Network error. Please check your internet connection"}};for(const[w,g]of Object.entries(m))if(t.toLowerCase().includes(w.toLowerCase()))return g[d];return t.includes("phone")||t.includes("رقم")?d==="ar"?"❌ رقم الهاتف غير صحيح":"❌ Invalid phone number":t.includes("password")||t.includes("كلمة المرور")?d==="ar"?"❌ كلمة المرور غير صحيحة":"❌ Invalid password":d==="ar"?`❌ حدث خطأ: ${t}`:`❌ Error: ${t}`}async function fe(l){l.preventDefault(),c(!0);try{if(!r.trim()||!h.trim()){i.error(a.lang==="ar"?"❌ رقم الهاتف وكلمة المرور مطلوبة":"❌ Phone and password are required"),c(!1);return}if(!J(r).valid){i.error(a.lang==="ar"?"❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx":"❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx"),c(!1);return}const d=r.replace(/[^0-9]/g,""),m=[`sy${d}@souqi.local`,`${d}@delivery.com`,`${d}@distributor.sy`,`${d}@company-admin.com`,`${d}@company.com`];let w=null,g=null;for(const k of m){console.log("🔍 Trying email format:",k);const L=await f.auth.signInWithPassword({email:k,password:h});if(L.error)g=L.error;else{w=L.data,console.log("✅ Successfully signed in with:",k);break}}if(!w&&g){const k=X(g);i.error(k),c(!1);return}const j=await ne(w.user);i.success(a.lang==="ar"?"✨ أهلاً بعودتك إلى ذوق":"✨ Welcome back to Zooq"),setTimeout(()=>{window.location.replace(j.url)},300)}catch(t){console.error("❌ Login error:",t);const d=X(t);i.error(d)}finally{c(!1)}}async function me(l){l.preventDefault(),c(!0);try{if(!r.trim()){i.error(a.lang==="ar"?"❌ رقم الهاتف مطلوب":"❌ Phone is required"),c(!1);return}if(!J(r).valid){i.error(a.lang==="ar"?"❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx":"❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx"),c(!1);return}if(v){i.error(v),c(!1);return}if(P===!1){i.error(a.lang==="ar"?"⚠️ هذا الرقم مستخدم من قبل":"⚠️ This phone is already in use"),c(!1);return}if(!y.trim()){i.error(a.lang==="ar"?"❌ الاسم الكامل مطلوب":"❌ Full name is required"),c(!1);return}if(!h.trim()){i.error(a.lang==="ar"?"❌ كلمة المرور مطلوبة":"❌ Password is required"),c(!1);return}if(h.length<6){i.error(a.lang==="ar"?"❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل":"❌ Password must be at least 6 characters"),c(!1);return}if(!p){i.error(a.lang==="ar"?"❌ الرجاء اختيار الموقع على الخريطة":"❌ Please select a location on the map"),c(!1);return}if(!p.address||p.address.trim()===""){i.error(a.lang==="ar"?"❌ الرجاء اختيار عنوان صحيح من الخريطة":"❌ Please select a valid address from the map"),c(!1);return}if(!(p.details?.trim()||"")){i.error(a.lang==="ar"?"❌ الرجاء إدخال وصف تفصيلي للعنوان":"❌ Please enter a detailed description for the address"),c(!1);return}const{data:m,error:w}=await f.auth.signUp({email:oe(r),password:h,options:{data:{full_name:y.trim(),phone:r.trim()}}});if(w){const G=K(w);i.error(G),c(!1);return}const g=await f.auth.signInWithPassword({email:oe(r),password:h});if(g.error){const G=X(g.error);i.error(G),c(!1);return}const j=g.data.user?.id??m?.user?.id;if(!j){i.error(a.lang==="ar"?"❌ فشل تسجيل الدخول بعد التسجيل":"❌ Failed to sign in after registration"),c(!1);return}const k={id:j,full_name:y.trim(),phone:r.trim()},{error:L}=await f.from("profiles").upsert(k,{onConflict:"id"});if(L){console.error("Profile error:",L),i.error(a.lang==="ar"?"⚠️ حدث خطأ في حفظ الملف الشخصي":"⚠️ Error saving profile"),c(!1);return}const ee=await Xe(j,p);ee.success||console.warn("⚠️ Address saved but governorate extraction failed:",ee.error),N&&i.success(a.lang==="ar"?`✨ تم تحديد المحافظة: ${N}`:`✨ Governorate detected: ${N}`),i.success(a.lang==="ar"?"🎉 أهلاً فيك بعالم ذوق!":"🎉 Welcome to the world of Zooq!");const{data:{user:ae}}=await f.auth.getUser();if(ae){const G=await ne(ae);setTimeout(()=>{window.location.replace(G.url)},500)}else setTimeout(()=>{window.location.replace("/")},500)}catch(t){console.error("Registration error:",t);const d=K(t);i.error(d)}finally{c(!1)}}async function he(l){l.preventDefault(),F?await fe(l):await me(l)}const{data:Y=[]}=_e(a.user?.id),ge=Y.includes("delivery_company"),pe=Y.includes("distributor"),be=Y.includes("admin"),we=Y.includes("seller"),ve=new Date().getFullYear();return Ve[H]?.icon??ie,e.jsxs("div",{dir:a.lang==="ar"?"rtl":"ltr",className:"relative min-h-[calc(100vh-140px)] overflow-hidden bg-[#071f1c] text-white selection:bg-[#f9a8d4]/30",children:[e.jsxs("div",{className:"absolute inset-0 -z-10 overflow-hidden bg-[#071f1c]",children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx("img",{src:"/images/Logo.png",alt:"",draggable:!1,className:`
              absolute
              inset-0
              h-full
              w-full
              object-cover
              select-none
              pointer-events-none
              opacity-[0.05]
              sm:opacity-[0.07]
              md:opacity-[0.09]
              lg:opacity-[0.11]
              animate-[logo-float-bg_12s_ease-in-out_infinite]
            `,style:{filter:"blur(0.5px) drop-shadow(0 0 100px rgba(249,168,212,0.04))"}})}),e.jsx("div",{className:`
            absolute
            left-1/2
            top-1/2
            aspect-square
            w-[70%]
            max-w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#f9a8d4]/[0.04]
            blur-3xl
            animate-[pulse-glow_8s_ease-in-out_infinite]
          `}),e.jsx("div",{className:`
            absolute
            left-1/2
            top-1/2
            aspect-square
            w-[50%]
            max-w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#2a655f]/[0.05]
            blur-3xl
            animate-[pulse-glow_10s_ease-in-out_infinite]
            delay-1000
          `})]}),e.jsx("style",{children:`
        @keyframes logo-float-bg {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }

          25% {
            transform: scale(1.03) rotate(1deg);
          }

          50% {
            transform: scale(1.06) rotate(0deg);
          }

          75% {
            transform: scale(1.03) rotate(-1deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }

          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes zooq-shine {
          0% {
            transform: translateX(-140%) skewX(-18deg);
          }

          100% {
            transform: translateX(280%) skewX(-18deg);
          }
        }

        @keyframes shimmer-gold {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        @keyframes logo-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }

          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }

        .zooq-glass {
          background:
            linear-gradient(
              145deg,
              rgba(9,35,32,.92),
              rgba(20,68,63,.85)
            );

          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);

          border: 1px solid rgba(255,255,255,.09);

          box-shadow:
            0 35px 100px rgba(0,0,0,.52),
            inset 0 1px 0 rgba(255,255,255,.055);
        }

        .zooq-submit {
          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #fbcfe8 28%,
              #f9a8d4 70%,
              #2a655f 135%
            );

          color: #082520;

          box-shadow:
            0 16px 38px rgba(249,168,212,.26),
            inset 0 1px 0 rgba(255,255,255,.7);

          transition:
            transform .3s ease,
            box-shadow .3s ease,
            filter .3s ease;
        }

        .zooq-submit:hover:not(:disabled) {
          transform: translateY(-3px);

          box-shadow:
            0 22px 50px rgba(249,168,212,.38),
            0 0 25px rgba(42,101,95,.16);

          filter: brightness(1.035);
        }

        .zooq-submit:active:not(:disabled) {
          transform: translateY(-1px) scale(.99);
        }

        .zooq-submit:disabled {
          opacity: .58;
          cursor: not-allowed;
        }

        .zooq-link {
          transition:
            color .2s ease,
            opacity .2s ease,
            transform .2s ease;
        }

        .zooq-link:hover {
          color: #f9a8d4;
        }

        .logo-animate {
          animation:
            logo-float 4s ease-in-out infinite;
        }

        .zooq-brand-title {
          text-shadow:
            0 15px 45px rgba(0,0,0,.35);
        }

        .zooq-o-pink {
          color: #f9a8d4;

          text-shadow:
            0 0 30px rgba(249,168,212,.38);
        }

        .zooq-o-olive {
          color: #2a655f;

          text-shadow:
            0 0 24px rgba(42,101,95,.32);
        }

        .zooq-logo-ring {
          animation:
            logo-float 8s linear infinite;

          transform-origin: center;
        }

        .zooq-social {
          transition: all .25s ease;
        }

        .zooq-social:hover {
          transform: translateY(-4px);

          color: #f9a8d4;

          border-color:
            rgba(249,168,212,.38);

          background:
            rgba(42,101,95,.18);

          box-shadow:
            0 8px 25px rgba(249,168,212,.08);
        }

        .slide-content {
          animation:
            slide-enter .6s ease both;
        }

        @keyframes slide-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .zooq-slide-title-accent {
          position: relative;
          display: inline-block;
        }

        .zooq-slide-title-accent::after {
          content: "";

          position: absolute;

          left: 4%;
          right: 4%;

          bottom: -7px;

          height: 3px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #2a655f 25%,
              #f9a8d4 50%,
              #2a655f 75%,
              transparent
            );

          opacity: .72;

          filter: blur(.2px);
        }

        .zooq-slide-accent-line {
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(42,101,95,.95),
              rgba(249,168,212,.85),
              transparent
            );
        }
      `}),e.jsxs("div",{className:"pointer-events-none absolute inset-0 overflow-hidden",children:[e.jsx("div",{className:"absolute -start-32 -top-32 h-96 w-96 rounded-full bg-[#f9a8d4]/8 blur-3xl"}),e.jsx("div",{className:"absolute -bottom-40 -end-20 h-[30rem] w-[30rem] rounded-full bg-[#2a655f]/20 blur-3xl"}),e.jsx("div",{className:"absolute start-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fbcfe8]/4 blur-3xl"})]}),e.jsx("div",{className:"relative mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-6xl items-center justify-center px-4 py-7",children:e.jsx("div",{className:"w-full max-w-lg mx-auto",children:e.jsxs("div",{className:"zooq-glass relative w-full overflow-hidden rounded-[2.5rem] p-6 shadow-[0_40px_120px_rgba(0,0,0,.55)] sm:p-8",children:[e.jsx("div",{className:"absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f9a8d4] to-[#2a655f] opacity-90"}),e.jsxs("div",{className:"relative mb-6 flex flex-col items-center text-center",children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("h1",{className:"zooq-brand-title text-3xl font-black leading-none tracking-[-.06em] sm:text-4xl",dir:"rtl",children:e.jsx("span",{className:"bg-gradient-to-r from-white via-[#fbcfe8] to-[#f9a8d4] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer-gold_4s_linear_infinite]",children:"ذوق"})})}),e.jsxs("div",{className:"mt-2 flex items-center gap-2",children:[e.jsx("span",{className:"h-px w-6 bg-gradient-to-r from-transparent to-[#2a655f]/50"}),e.jsxs("span",{className:"text-base font-black tracking-[.2em] sm:text-lg",children:[e.jsx("span",{className:"text-[#2a655f]",children:"z"}),e.jsx("span",{className:"zooq-o-pink",children:"o"}),e.jsx("span",{className:"text-[#2a655f]",children:"o"}),e.jsx("span",{className:"text-[#2a655f]",children:"q"})]}),e.jsx("span",{className:"h-px w-6 bg-gradient-to-l from-transparent to-[#f9a8d4]/50"})]}),e.jsxs("div",{className:"mt-2 flex items-center gap-2 rounded-full border border-[#f9a8d4]/15 bg-gradient-to-r from-[#2a655f]/10 via-[#f9a8d4]/[.045] to-[#fbcfe8]/[.05] px-3 py-1",children:[e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-[#2a655f] shadow-[0_0_12px_rgba(42,101,95,.8)]"}),e.jsx("span",{className:"text-[9px] font-black tracking-[.08em] text-white/60 sm:text-[10px]",children:a.lang==="ar"?"كلشي ع ذوقك":"Exactly your taste"}),e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-[#f9a8d4] shadow-[0_0_12px_rgba(249,168,212,.8)]"})]})]}),e.jsxs("div",{className:"relative my-4 flex items-center gap-3",children:[e.jsx("div",{className:"h-px flex-1 bg-gradient-to-r from-transparent to-[#2a655f]/30"}),e.jsx("span",{className:"text-[8px] font-black tracking-[.25em] text-white/20",children:F?a.lang==="ar"?"دخول":"LOGIN":a.lang==="ar"?"تسجيل":"REGISTER"}),e.jsx("div",{className:"h-px flex-1 bg-gradient-to-l from-transparent to-[#f9a8d4]/30"})]}),e.jsxs("form",{className:"relative space-y-4",onSubmit:he,autoComplete:"off",children:[_&&e.jsx(V,{label:o("full_name")+" *",icon:e.jsx(Pe,{className:"h-4 w-4 text-[#f9a8d4]"}),children:e.jsx(A,{value:y,onChange:l=>C(l.target.value),required:!0,autoComplete:"off",className:"input-glow rounded-2xl border-0 transition-all duration-300",placeholder:a.lang==="ar"?"الاسم اللي بتحب نناديك فيه":"The name you'd like us to call you"})}),e.jsx(V,{label:o("phone")+" *",icon:e.jsx(ze,{className:"h-4 w-4 text-[#f9a8d4]"}),children:e.jsxs("div",{className:"zooq-input relative rounded-2xl",children:[e.jsx(A,{type:"tel",placeholder:"+963 9xx xxx xxx",value:r,onChange:l=>u(l.target.value),required:!0,autoComplete:"off",className:`input-glow rounded-2xl border-0 pe-10 transition-all duration-300 ${v&&_?"border-red-500 focus-visible:ring-red-500":""} ${P===!0&&_&&r.trim().length>=5?"border-[#f9a8d4]":""}`}),_&&r.trim().length>=5&&e.jsx("div",{className:"absolute inset-y-0 end-3 flex items-center",children:E?e.jsx(se,{className:"h-4 w-4 animate-spin text-[#f9a8d4]"}):P===!0?e.jsx(de,{className:"h-4 w-4 text-[#2a655f]"}):P===!1?e.jsx(ce,{className:"h-4 w-4 text-red-400"}):null})]})}),_&&r.trim().length>=5&&v&&e.jsxs("div",{className:"flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5",children:[e.jsx(Ce,{className:"h-4 w-4 shrink-0 text-red-400"}),e.jsx("p",{className:"text-xs font-semibold text-red-200",children:v})]}),e.jsx(V,{label:o("password")+" *",icon:e.jsx(te,{className:"h-4 w-4 text-[#f9a8d4]"}),children:e.jsxs("div",{className:"zooq-input relative rounded-2xl",children:[e.jsx(A,{type:z?"text":"password",value:h,onChange:l=>b(l.target.value),required:!0,minLength:6,autoComplete:"off",className:"input-glow rounded-2xl border-0 pe-10 transition-all duration-300",placeholder:a.lang==="ar"?"كلمة المرور — 6 أحرف على الأقل":"Password — 6+ characters"}),e.jsx("button",{type:"button",onClick:()=>B(!z),className:"absolute inset-y-0 end-3 my-auto text-[#f9a8d4]/70 transition hover:text-[#f9a8d4]","aria-label":z?"Hide password":"Show password",children:z?e.jsx(Re,{className:"h-4 w-4"}):e.jsx(Ee,{className:"h-4 w-4"})})]})}),_&&e.jsxs("div",{className:"space-y-2",children:[e.jsxs(D,{className:"flex items-center gap-2 text-xs font-bold text-white/85",children:[e.jsx("span",{className:"h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]"}),a.lang==="ar"?"وين بدنا نوصل طلباتك؟ *":"Where should we deliver? *"]}),e.jsx("div",{className:"rounded-2xl border border-white/10 bg-white/[.96] p-3 text-slate-800 transition-all duration-300 focus-within:border-[#f9a8d4]/60 focus-within:shadow-[0_0_0_3px_rgba(249,168,212,.08)]",children:e.jsx(Te,{value:p??void 0,onChange:Z,lang:a.lang})}),p&&N&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-[#f9a8d4]/20 bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/[.07] p-2.5",children:[$?e.jsx(se,{className:"h-3.5 w-3.5 animate-spin text-[#f9a8d4]"}):e.jsx(Ie,{className:"h-3.5 w-3.5 text-[#2a655f]"}),e.jsx("span",{className:"text-[11px] font-medium text-[#fbcfe8]",children:$?a.lang==="ar"?"عم نحدد منطقتك...":"Detecting your area...":N?a.lang==="ar"?`المحافظة: ${N}`:`Governorate: ${N}`:a.lang==="ar"?"⚠️ لم يتم التحديد":"⚠️ Not detected"})]})]}),e.jsxs(Q,{type:"submit",size:"lg",className:"zooq-submit group relative mt-2 h-13 w-full overflow-hidden rounded-2xl border-0 text-base font-black",disabled:M||_&&(P===!1||v!==null),children:[e.jsx("span",{className:"zooq-shine pointer-events-none absolute inset-y-0 -start-1/2 w-1/2 skew-x-[-18deg] bg-white/20 animate-[zooq-shine_2.8s_ease-in-out_infinite]"}),M?e.jsxs("span",{className:"relative z-10 flex items-center justify-center gap-2",children:[e.jsx("span",{className:"h-4 w-4 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent"}),a.lang==="ar"?"لحظة… عم نجهز كل شي":"Just a moment..."]}):e.jsxs("span",{className:"relative z-10 flex items-center justify-center gap-2",children:[F?e.jsx(te,{className:"h-4 w-4"}):e.jsx($e,{className:"h-4 w-4"}),F?a.lang==="ar"?"دخول إلى ذوق":"Enter Zooq":a.lang==="ar"?"ابدأ رحلتك مع ذوق":"Start your Zooq journey"]})]}),e.jsx("div",{className:"space-y-3 pt-2 text-center text-sm text-white/65",children:F?e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[a.lang==="ar"?"لسا ما صار عندك حساب؟":"Don't have an account?"," ",e.jsx(q,{to:"/auth/$mode",params:{mode:"register"},className:"zooq-link font-black text-[#f9a8d4]",children:a.lang==="ar"?"خلينا نبدأ":"Let's start"})]}),e.jsxs("button",{type:"button",onClick:ue,className:"zooq-link mx-auto flex items-center justify-center gap-1.5 text-xs text-white/40",children:[e.jsx(Le,{className:"h-3.5 w-3.5 text-[#f9a8d4]"}),a.lang==="ar"?"نسيت كلمة المرور؟":"Forgot your password?"]}),a.user&&e.jsxs("div",{className:"mt-3 space-y-1.5 border-t border-white/8 pt-3",children:[ge&&e.jsxs(q,{to:"/delivery/dashboard",className:"zooq-link block text-xs text-[#f9a8d4]",children:["🚚 ",a.lang==="ar"?"لوحة التوصيل":"Delivery Dashboard"]}),pe&&e.jsxs(q,{to:"/distributor/dashboard",className:"zooq-link block text-xs text-[#2a655f]",children:["📦 ",a.lang==="ar"?"لوحة الموزع":"Distributor Dashboard"]}),be&&e.jsxs(q,{to:"/admin",className:"zooq-link block text-xs text-red-300",children:["⚡ ",a.lang==="ar"?"لوحة الأدمن":"Admin Panel"]}),we&&e.jsxs(q,{to:"/dashboard",className:"zooq-link block text-xs text-amber-300",children:["🏪 ",a.lang==="ar"?"لوحة البائع":"Seller Dashboard"]})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[a.lang==="ar"?"عندك حساب معنا؟":"Already part of Zooq?"," ",e.jsx(q,{to:"/auth/$mode",params:{mode:"login"},className:"zooq-link font-black text-[#f9a8d4]",children:a.lang==="ar"?"فوت لعندنا":"Sign in"})]}),e.jsxs("div",{className:"relative pt-4",children:[e.jsxs("div",{className:"absolute inset-x-0 top-0 flex items-center gap-3",children:[e.jsx("div",{className:"h-px flex-1 bg-gradient-to-r from-transparent to-[#2a655f]/20"}),e.jsx("span",{className:"text-[9px] font-black tracking-[.25em] text-white/25",children:a.lang==="ar"?"أو":"OR"}),e.jsx("div",{className:"h-px flex-1 bg-gradient-to-l from-transparent to-[#f9a8d4]/20"})]}),e.jsx(q,{to:"/",className:"block w-full",children:e.jsx(Q,{variant:"outline",className:"mt-2 h-11 w-full rounded-2xl border-white/10 bg-white/[.035] text-sm font-bold text-white hover:border-[#f9a8d4]/35 hover:bg-[#2a655f]/10 hover:text-white",children:a.lang==="ar"?"خليني اكتشف أول 👀":"Let me explore first 👀"})}),e.jsx("p",{className:"mt-2 text-[10px] text-white/30",children:a.lang==="ar"?"تصفح، اكتشف، وخلي التسجيل لوقت ما تكون جاهز.":"Explore first. Sign up when you're ready."})]})]})})]}),e.jsxs("div",{className:"relative mt-6 flex flex-col items-center justify-center gap-2 border-t border-white/7 pt-4 text-center",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"h-1 w-1 rounded-full bg-[#2a655f] shadow-[0_0_8px_rgba(42,101,95,.8)]"}),e.jsx("span",{className:"text-[9px] font-black tracking-[.28em] text-white/25",children:"zooq"}),e.jsx("span",{className:"h-1 w-1 rounded-full bg-[#f9a8d4] shadow-[0_0_8px_rgba(249,168,212,.8)]"})]}),e.jsx("p",{className:"text-[10px] font-semibold text-white/30",children:a.lang==="ar"?"كلشي ع ذوقك":"Exactly your taste"})]})]})})}),e.jsx("div",{className:"relative mx-auto w-full max-w-6xl px-4 pb-5",children:e.jsx("div",{className:"border-t border-white/7 pt-4",children:e.jsxs("div",{className:"flex flex-col items-center justify-between gap-3 sm:flex-row",children:[e.jsx("div",{className:"flex items-center gap-1.5",children:[{icon:Ue,label:"Twitter"},{icon:Oe,label:"Instagram"},{icon:Fe,label:"Facebook"},{icon:Be,label:"YouTube"},{icon:De,label:"Website"}].map(l=>{const t=l.icon;return e.jsx("a",{href:"#","aria-label":l.label,className:"zooq-social flex h-8 w-8 items-center justify-center rounded-xl border border-white/7 bg-white/[.025] text-white/30",children:e.jsx(t,{className:"h-3.5 w-3.5"})},l.label)})}),e.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-2 text-[10px]",children:[e.jsx(q,{to:"/privacy",className:"zooq-link text-white/32",children:a.lang==="ar"?"الخصوصية":"Privacy"}),e.jsx("span",{className:"text-white/15",children:"•"}),e.jsx(q,{to:"/terms",className:"zooq-link text-white/32",children:a.lang==="ar"?"الشروط":"Terms"}),e.jsx("span",{className:"text-white/15",children:"•"}),e.jsxs("span",{className:"text-white/25",children:["© ",ve," ذوق"]})]})]})})}),e.jsx(Qe,{})]})}function Qe(){const s=le(),[a,o]=x.useState(!1),[n,r]=x.useState(""),[u,h]=x.useState(""),[b,y]=x.useState(""),[C,p]=x.useState(!1),[Z,M]=x.useState(!1),[c,z]=x.useState(!1),B=()=>o(!0),H=async()=>{if(!(s.user?.phone||b.trim())){i.error(s.lang==="ar"?"الرجاء إدخال رقم هاتفك للتواصل معك":"Please enter your phone number");return}if(!n.trim()){i.error(s.lang==="ar"?"الرجاء كتابة رسالتك":"Please write your message");return}p(!0);try{const{data:E,error:O}=await f.from("user_roles").select("user_id").eq("role","admin").limit(1).single();if(O||!E){i.error(s.lang==="ar"?"حدث خطأ، يرجى المحاولة لاحقاً":"Error, please try again later");return}const v=E.user_id,T=s.user?.id||v,P=s.user?.phone||b.trim(),I=!!s.user,{data:N,error:R}=await f.from("conversations").insert({participant1_id:T,participant2_id:v,last_message:n.substring(0,100),last_message_at:new Date().toISOString()}).select().single();if(R)throw R;const $=N.id,{error:W}=await f.from("messages").insert({sender_id:T,receiver_id:v,conversation_id:$,content:`📩 رسالة دعم
📞 من: ${P}
${I?"✅ مستخدم مسجل":"❌ زائر (ليس لديه حساب)"}
الموضوع: ${u||"دعم"}

الرسالة:
${n}`,type:"text",created_at:new Date().toISOString()});if(W)throw W;await f.from("notifications").insert({user_id:v,type:"support",title_ar:"📩 رسالة دعم جديدة",body_ar:`📞 من: ${P}
${I?"✅ مسجل":"❌ زائر"}
الموضوع: ${u||"دعم"}`,reference_id:$,link_url:`/messages/${$}`,created_at:new Date().toISOString()}),M(!0),setTimeout(()=>{o(!1),M(!1),r(""),h(""),y("")},2e3),i.success(s.lang==="ar"?"✅ وصلت رسالتك! نحنا معك.":"✅ Your message is on its way!")}catch(E){console.error("Error sending support message:",E),i.error(s.lang==="ar"?"حدث خطأ أثناء الإرسال":"Error sending message")}finally{p(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed bottom-6 start-6 z-50",children:e.jsxs("button",{onClick:B,onMouseEnter:()=>z(!0),onMouseLeave:()=>z(!1),className:"group relative flex items-center gap-3 rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] px-4 py-2.5 text-white shadow-lg shadow-[#f9a8d4]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#f9a8d4]/45 hover:shadow-xl hover:shadow-[#f9a8d4]/25",children:[e.jsxs("div",{className:"relative",children:[e.jsx(re,{className:"h-5 w-5 text-[#f9a8d4]"}),!c&&e.jsx("span",{className:"absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#fbcfe8] shadow-[0_0_8px_rgba(249,168,212,.8)]"})]}),e.jsx("span",{className:"hidden text-sm font-bold sm:inline",children:s.lang==="ar"?"نحنا هون":"We're here"})]})}),a&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed inset-0 z-[100] animate-in fade-in bg-black/65 backdrop-blur-md duration-200",onClick:()=>o(!1)}),e.jsx("div",{className:"fixed inset-0 z-[101] flex items-center justify-center p-4",children:e.jsxs("div",{className:"w-full max-w-md animate-in overflow-hidden rounded-[2rem] border border-[#f9a8d4]/25 bg-[#071f1c] shadow-[0_35px_100px_rgba(0,0,0,.58)] zoom-in-95 duration-300",children:[e.jsx("div",{className:"border-b border-[#f9a8d4]/15 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-br from-[#2a655f]/30 to-[#f9a8d4]/15",children:e.jsx(re,{className:"h-6 w-6 text-[#f9a8d4]"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-black text-white",children:s.lang==="ar"?"خلينا نساعدك":"Let's help you"}),e.jsx("p",{className:"mt-0.5 text-sm text-[#fbcfe8]/80",children:s.lang==="ar"?"رسالتك بتوصلنا مباشرة 💗":"Your message reaches us directly 💗"})]})]}),e.jsx("button",{onClick:()=>o(!1),className:"text-white/50 transition-colors hover:text-white",children:e.jsx(ce,{className:"h-5 w-5"})})]})}),e.jsx("div",{className:"space-y-4 p-6",children:Z?e.jsxs("div",{className:"py-8 text-center",children:[e.jsx("div",{className:"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#f9a8d4]/30 bg-[#f9a8d4]/15",children:e.jsx(de,{className:"h-8 w-8 text-[#f9a8d4]"})}),e.jsx("h4",{className:"text-lg font-black text-white",children:s.lang==="ar"?"وصلت! 💗":"Got it! 💗"}),e.jsx("p",{className:"mt-1 text-sm text-[#fbcfe8]/80",children:s.lang==="ar"?"نحنا معك، وراح نرد عليك بأسرع وقت.":"We're on it and will get back to you soon."})]}):e.jsxs(e.Fragment,{children:[s.user?e.jsxs("div",{children:[e.jsx(D,{className:"text-sm font-semibold text-white/90",children:s.lang==="ar"?"رقم هاتفك":"Your Phone"}),e.jsx(A,{type:"tel",value:s.user?.phone||"غير متاح",disabled:!0,className:"mt-1.5 h-11 cursor-not-allowed rounded-xl border-[#f9a8d4]/20 bg-white/10 text-white"})]}):e.jsxs("div",{children:[e.jsx(D,{className:"text-sm font-semibold text-white/90",children:s.lang==="ar"?"رقم الهاتف *":"Phone Number *"}),e.jsx(A,{type:"tel",value:b,onChange:S=>y(S.target.value),placeholder:"+963 9xx xxx xxx",className:"mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50",required:!0}),e.jsx("p",{className:"mt-1 text-[10px] text-white/40",children:s.lang==="ar"?"بس مشان نقدر نرجعلك":"So we can get back to you"})]}),e.jsxs("div",{children:[e.jsx(D,{className:"text-sm font-semibold text-white/90",children:s.lang==="ar"?"شو الموضوع؟":"What's on your mind?"}),e.jsx(A,{value:u,onChange:S=>h(S.target.value),placeholder:s.lang==="ar"?"مثلاً: مشكلة بالحساب...":"e.g. Account issue...",className:"mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50"})]}),e.jsxs("div",{children:[e.jsx(D,{className:"text-sm font-semibold text-white/90",children:s.lang==="ar"?"احكيلنا شو صار *":"Tell us what happened *"}),e.jsx("textarea",{value:n,onChange:S=>r(S.target.value),placeholder:s.lang==="ar"?"اكتب رسالتك هون… نحنا سامعينك.":"Write your message here...",rows:4,className:"mt-1.5 w-full resize-none rounded-xl border border-[#f9a8d4]/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50 focus:bg-white/10 focus:outline-none"})]}),e.jsx(Q,{onClick:H,disabled:C||!n.trim()||!s.user&&!b.trim(),className:"h-12 w-full rounded-xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#174944] to-[#2a655f] font-black text-white shadow-lg shadow-[#f9a8d4]/15 transition-all hover:-translate-y-0.5 hover:border-[#f9a8d4]/45 hover:shadow-[#f9a8d4]/25",children:C?e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"}),s.lang==="ar"?"عم نوصلها...":"Sending..."]}):e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(Ae,{className:"h-4 w-4 text-[#f9a8d4]"}),s.lang==="ar"?"إرسال الرسالة":"Send message"]})})]})})]})})]})]})}export{sa as component};
