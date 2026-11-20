"use strict";
let py=null;
let taskQueue=Promise.resolve();
self.onmessage=(event)=>{
 const m=event.data;
 taskQueue=taskQueue.catch(()=>{}).then(async()=>{
 try {
  if(!py){
   const base="https://cdn.jsdelivr.net/pyodide/v314.0.8/full/";
   self.postMessage({kind:"progress",text:"جاري استيراد محرك Python 3.14…"});
   let loadPyodide;
   try { ({loadPyodide}=await import(base+"pyodide.mjs")); }
   catch(e){throw new Error("تعذّر تنزيل وحدة Pyodide (pyodide.mjs): "+String(e?.message||e));}
   self.postMessage({kind:"progress",text:"جاري تحميل ملفات Python و WebAssembly…"});
   try {py=await loadPyodide({indexURL:base});}
   catch(e){throw new Error("فشل تهيئة محرك Python: "+String(e?.message||e));}
   if(py.runPython("2+3")!==5){throw new Error("لم ينجح الاختبار الداخلي لمحرك Python");}
   self.postMessage({kind:"ready"});
  }
  py.globals.set("COURSE_SOURCE",m.source);
  py.globals.set("COURSE_MODE",m.command);
  py.globals.set("COURSE_TESTS_JSON",JSON.stringify(m.tests||[]));
  py.globals.set("COURSE_PAYLOAD_JSON",JSON.stringify(m.payload||{}));
  const response=await py.runPythonAsync("import sys, io, json, traceback, contextlib\nout = {\"stdout\":\"\", \"error\":None, \"tests\":[], \"value\":None, \"trace\":[]}\ncode = COURSE_SOURCE\nmode = COURSE_MODE\ncases = json.loads(COURSE_TESTS_JSON)\npayload = json.loads(COURSE_PAYLOAD_JSON)\nnamespace={\"__name__\":\"__main__\"}\nbuf=io.StringIO()\ntry:\n    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):\n        exec(compile(code, \"<student>\", \"exec\"),namespace,namespace)\n        if mode == \"check\":\n            for test in cases:\n                try:\n                    exec(compile(test[\"code\"], \"<test>\", \"exec\"), namespace, namespace)\n                    out[\"tests\"].append({\"name\":test[\"name\"],\"ok\":True,\"message\":\"\"})\n                except Exception as e:\n                    detail = ''.join(traceback.format_exception_only(type(e), e)).strip()\n                    if isinstance(e,AssertionError): detail = \"الناتج لا يطابق القيمة المطلوبة (AssertionError)\"\n                    out[\"tests\"].append({\"name\":test[\"name\"],\"ok\":False,\"message\":detail[:250]})\n        if mode == \"cipher\":\n            fn_name=payload.get(\"functionName\")\n            fn=namespace.get(fn_name)\n            if not callable(fn): raise NameError(\"لم نجد الدالة المطلوبة: \"+str(fn_name))\n            def trace_callback(frame,event,arg):\n                if event == \"line\" and frame.f_code.co_filename == \"<student>\" and len(out[\"trace\"])<250:\n                    local={}\n                    for k,v in frame.f_locals.copy().items():\n                        if not k.startswith(\"__\"):\n                            try: local[k]=repr(v)[:105]\n                            except: local[k]=\"[object]\"\n                    out[\"trace\"].append({\"line\":frame.f_lineno,\"fn\":frame.f_code.co_name,\"locals\":local})\n                return trace_callback\n            old_trace = sys.gettrace()\n            sys.settrace(trace_callback)\n            try:\n                out[\"value\"]=str(fn(payload.get(\"text\",\"\"),payload.get(\"key\")))\n            finally: sys.settrace(old_trace)\nexcept BaseException as e:\n    out[\"error\"]=''.join(traceback.format_exception(type(e),e,e.__traceback__))[-1600:]\nout[\"stdout\"]=buf.getvalue()[-12000:]\njson.dumps(out,ensure_ascii=False)\n");
  self.postMessage({id:m.id,kind:"done",result:JSON.parse(response)});
 }catch(e){self.postMessage({id:m.id,kind:"error",error:"فشل محرّك Python: "+String(e?.stack||e?.message||e).slice(0,1100)});}
});
};