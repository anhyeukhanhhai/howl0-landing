import type { Locale } from "@/lib/i18n";

// Additions from the PARA resource pack. Existing dictionaries remain the source
// for the product story, audience roles, FAQ and development qualifications.
export const paraContent = {
  en: {
    concept: "Conceptual learning story · Product in development",
    comparison:
      "Illustrative attempts · Teacher guidance · Not measured performance data",
    play: "Play story",
    pause: "Pause story",
    next: "Next step",
    brandLabel: "THE PARA IDEA",
    brandCycle: "Practice → Assess → Review → Again",
    brandCopy:
      "Our name describes a habit of improvement. The product workflow above keeps teacher guidance at the centre of that habit.",
    details: [
      "A clear practice task, shared by the teacher.",
      "Time to explore the phrase between lessons.",
      "Open a link. Upload an audio or video attempt.",
      "Useful guidance, in the context of the task.",
      "A next step—and another attempt.",
    ],
  },
  vi: {
    concept: "Minh họa ý tưởng · Sản phẩm đang phát triển",
    comparison:
      "Minh họa các lần thử · Hướng dẫn của giáo viên · Không phải số liệu đo lường",
    play: "Xem hành trình",
    pause: "Tạm dừng",
    next: "Bước tiếp theo",
    brandLabel: "Ý NGHĨA PARA",
    brandCycle: "Luyện tập → Đánh giá → Xem lại → Thử lại",
    brandCopy:
      "Tên gọi thể hiện thói quen cải thiện. Quy trình sản phẩm phía trên luôn đặt sự hướng dẫn của giáo viên ở vị trí trung tâm.",
    details: [
      "Giáo viên chia sẻ một nhiệm vụ luyện tập rõ ràng.",
      "Luyện tập giữa những buổi học.",
      "Mở liên kết. Tải lên bản ghi âm hoặc video.",
      "Phản hồi hữu ích gắn với bài luyện tập.",
      "Một bước tiếp theo—và một lần thử mới.",
    ],
  },
} as const;

export const audienceScenes = [
  "para-scene-04-teacher-feedback.svg",
  "para-scene-05-next-attempt.svg",
  "para-scene-06-parent-progress.svg",
] as const;

export function conceptCaption(locale: Locale) {
  return paraContent[locale].concept;
}
