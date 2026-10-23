import type { Locale } from "@/lib/i18n";
import { ScrollScene } from "@/components/ScrollScene";
import { ProductCta } from "@/components/ProductCta";
import { PerformanceReel } from "@/components/PerformanceReel";

const ending = {
  en: {
    availableLines: ["PARA is", "available now"],
    nextLines: ["Your next", "step starts", "here"],
    utilities: ["Social", "Contact", "Privacy", "Terms"],
  },
  vi: {
    availableLines: ["PARA đã", "sẵn sàng"],
    nextLines: ["Bắt đầu", "bước tiếp theo", "cùng PARA"],
    utilities: ["Mạng xã hội", "Liên hệ", "Quyền riêng tư", "Điều khoản"],
  },
};

export function ProductInvitation({ locale }: { locale: Locale }) {
  const copy = ending[locale];
  return (
    <ScrollScene id="waitlist" className="final-scene">
      <div className="final-composition">
        <h2 className="final-available">
          {copy.availableLines.map((line, index) => (
            <span key={line}>
              {index > 0 && " "}
              {line}
            </span>
          ))}
        </h2>
        <PerformanceReel locale={locale} />
        <div className="final-next-step">
          <p className="final-next">
            {copy.nextLines.map((line, index) => (
              <span key={line}>
                {index > 0 && " "}
                {line}
              </span>
            ))}
          </p>
          <ProductCta
            locale={locale}
            size="large"
            className="final-action"
            compartment
          />
        </div>
      </div>
      <footer className="final-utilities">
        {[copy.utilities.slice(0, 2), copy.utilities.slice(2)].map(
          (group, index) => (
            <div key={index}>
              {group.map((label) => (
                <button type="button" key={label}>
                  {label}
                </button>
              ))}
            </div>
          ),
        )}
      </footer>
    </ScrollScene>
  );
}
