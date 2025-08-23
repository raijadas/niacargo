import { useEffect, useRef } from "react";

export default function AdsenseBanner({ slot, style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.adsbygoogle && ref.current) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
      catch (e) { /* ignore re-push errors during HMR */ }
    }
  }, []);

  return (
    <ins
      ref={ref}
      className="adsbygoogle block my-6"
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-5056506973875388"
      data-ad-slot={slot}             /* create your slots in AdSense & paste id */
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
