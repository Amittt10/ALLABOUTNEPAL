// src/data/staticPlaces.js
export const places = [
  {   
    id: "lumbini",
    category: "unesco",
    title_en: "Lumbini",
    title_np: "लुम्बिनी",
    video_url: "/videos/intro-loop.mp4",
    thumbnail: "/images/patan.jpg",
    description_en: [
      { type: "title", content: "Lumbini – The Birthplace of Lord Buddha" },
      { type: "subtitle", content: "A Spiritual Journey to Peace and Harmony" },

      {
        type: "paragraph",
        content:
          "Lumbini is the birthplace of Lord Buddha and one of the most significant spiritual sites in the world. Siddhartha Gautama, the Lord Buddha, was born in 623 B.C. in the famous gardens of Lumbini, which soon became a place of pilgrimage. The site is located in the Rupandehi District of Nepal, near the Indian border. Lumbini is a UNESCO World Heritage Site and attracts thousands of pilgrims and tourists every year. It is a place of peace, meditation, and reflection, where visitors can explore the rich history and culture associated with Buddhism."
      },

      { type: "image", src: "/images/dashain.jpg", alt: "Lumbini sacred garden" },

      {
        type: "paragraph",
        content:
          "Among the pilgrims was the Indian emperor Ashoka, who erected one of his commemorative pillars there. The site is now being developed as a Buddhist pilgrimage centre. The Lumbini Development Trust is responsible for the preservation and development of the site, which includes the Maya Devi Temple, the Ashoka Pillar, and various monasteries built by different Buddhist countries."
      },

      { type: "image", src: "/images/holi.jpg", alt: "Ashoka Pillar at Lumbini" },

      {
        type: "paragraph",
        content:
          "The sacred gardens of Lumbini, Maya Devi Temple, and surrounding monasteries attract thousands of visitors every year. The site is a UNESCO World Heritage Site and is considered one of the most important pilgrimage sites for Buddhists worldwide. The gardens are beautifully maintained, providing a serene environment for meditation and reflection. Visitors can also explore the various monasteries built by different Buddhist countries, each showcasing unique architectural styles and cultural influences."
      },

      { type: "Peace", content: "Peace and Meditation" },

      {
        type: "paragraph",
        content:
          "Lumbini's development as a major pilgrimage site has led to improvements in infrastructure, including better roads, accommodations, and facilities for visitors. Lumbini is not just a place of historical significance but also a center for spiritual growth and enlightenment. The peaceful atmosphere, combined with the rich cultural heritage, makes Lumbini a must-visit destination for anyone interested in Buddhism or spirituality."
      },

      { type: "image", src: "/images/patan.jpg", alt: "Maya Devi Temple" },

      {
        type: "paragraph",
        content:
          "Overall, Lumbini stands as a testament to the enduring legacy of Buddha and his teachings."
      }
    ],
    description_np: [
      { type: "title", content: "लुम्बिनी – भगवान बुद्धको जन्मस्थल" },
      { type: "subtitle", content: "शान्तिको तीर्थ" },
      {
        type: "paragraph",
        content: "लुम्बिनी भगवान बुद्धको जन्मस्थल र विश्वको सबैभन्दा महत्वपूर्ण आध्यात्मिक स्थलहरूमध्ये एक हो। Lumbini, जसलाई सिद्धार्थ गौतमको जन्मस्थल मानिन्छ, ६२३ ईसा पूर्वमा लुम्बिनीको प्रसिद्ध बगैंचामा जन्मेका थिए। यो स्थल नेपालका रुपन्देही जिल्लामा अवस्थित छ र युनेस्को विश्व सम्पदा स्थलको रूपमा मान्यता प्राप्त छ। लुम्बिनीले हरेक वर्ष हजारौं तीर्थयात्री र पर्यटकलाई आकर्षित गर्छ। यो शान्ति, ध्यान र चिन्तनको स्थान हो, जहाँ आगन्तुकहरूले बौद्ध धर्मसँग सम्बन्धित समृद्ध इतिहास र संस्कृतिलाई अन्वेषण गर्न सक्छन्।"
      },
      { type: "image", src: "/images/lumbini_np1.jpg", alt: "लुम्बिनी तस्बिर" }
    ],

    images: [
      "/images/patan.jpg",
      "/images/lumbini2.jpg"
    ],
    location: { lat: 27.6792, lng: 83.5070 }
  },


  {
    id: "kathmandu",
    category: "unesco",
    title_en: "Kathmandu Valley",
    title_np: "काठमाडौँ उपत्यका",
    video_url: "/images/videos/kathmandu.mp4",
    thumbnail: "/images/tihar.jpg",
    description_en: [
      "Kathmandu Valley is rich in history and culture, containing seven UNESCO World Heritage Sites.",
      "Swayambhunath, Pashupatinath, Boudhanath, and Patan Durbar Square reflect the glorious past of Nepal."
    ],
    description_np: [
      "काठमाडौँ उपत्यका इतिहास र संस्कृतिले भरिएको छ, यहाँ सात वटा युनेस्को विश्व सम्पदा स्थलहरू रहेका छन्।",
      "स्वयम्भूनाथ, पशुपतिनाथ, बौद्धनाथ र पाटन दरबार स्क्वायर नेपालका गौरवशाली इतिहास झल्काउँछन्।"
    ],
    images: [
      "/images/kathmandu1.jpg",
      "/images/kathmandu2.jpg"
    ],
    location: { lat: 27.7172, lng: 85.3240 }
  },
  {
    id: "pashupatinath",
    category: "unesco",
    title_en: "Pashupatinath Temple",
    title_np: "पशुपतिनाथ मन्दिर",
    video_url: "/images/videos/pashupatinath.mp4",
    thumbnail: "/images/dashain.jpg",
    description_en: [
      "Pashupatinath Temple is one of the holiest Hindu temples in the world.",
      "Located on the banks of the Bagmati River, it is a major pilgrimage site and a center of Hindu culture."
    ],
    description_np: [
      "पशुपतिनाथ मन्दिर विश्वकै पवित्र हिन्दू मन्दिरहरूमध्ये एक हो।",
      "बागमती नदीको किनारमा अवस्थित यो मन्दिर हिन्दू संस्कृतिको महत्वपूर्ण केन्द्र र तीर्थस्थल हो।"
    ],
    images: [
      "/images/pashupatinath.jpg",
      "/images/pashupatinath2.jpg"
    ],
    location: { lat: 27.7105, lng: 85.3489 }
  },
  {
    id: "lumbini",
    category: "pilgrims",
    title_en: "Lumbini",
    title_np: "लुम्बिनी",
    video_url: "/images/videos/lumbini.mp4",
    thumbnail: "/images/patan.jpg",
    description_en: [
      "Lumbini is the birthplace of Lord Buddha and one of the most significant spiritual sites in the world.",
      "The sacred gardens of Lumbini, Maya Devi Temple, and surrounding monasteries attract thousands of visitors every year."
    ],
    description_np: [
      "लुम्बिनी भगवान बुद्धको जन्मस्थल र विश्वको सबैभन्दा महत्वपूर्ण आध्यात्मिक स्थलहरूमध्ये एक हो।",
      "पवित्र बगैंचा, मायादेवी मन्दिर र वरिपरि रहेका गुम्बाहरूले हरेक वर्ष हजारौं तीर्थयात्रीलाई आकर्षित गर्छन्।"
    ],
    images: [
      "/images/patan.jpg",
      "/images/lumbini2.jpg"
    ],
    location: { lat: 27.6792, lng: 83.5070 }
  },
  {
    id: "kathmandu",
    category: "unesco",
    title_en: "Kathmandu Valley",
    title_np: "काठमाडौँ उपत्यका",
    video_url: "/images/videos/kathmandu.mp4",
    thumbnail: "/images/kathmandu-thumbnail.jpg",
    description_en: [
      "Kathmandu Valley is rich in history and culture, containing seven UNESCO World Heritage Sites.",
      "Swayambhunath, Pashupatinath, Boudhanath, and Patan Durbar Square reflect the glorious past of Nepal."
    ],
    description_np: [
      "काठमाडौँ उपत्यका इतिहास र संस्कृतिले भरिएको छ, यहाँ सात वटा युनेस्को विश्व सम्पदा स्थलहरू रहेका छन्।",
      "स्वयम्भूनाथ, पशुपतिनाथ, बौद्धनाथ र पाटन दरबार स्क्वायर नेपालका गौरवशाली इतिहास झल्काउँछन्।"
    ],
    images: [
      "/images/kathmandu1.jpg",
      "/images/kathmandu2.jpg"
    ],
    location: { lat: 27.7172, lng: 85.3240 }
  },
  {
    id: "pashupatinath",
    category: "pilgrims",
    title_en: "Pashupatinath Temple",
    title_np: "पशुपतिनाथ मन्दिर",
    video_url: "/images/videos/pashupatinath.mp4",
    thumbnail: "/images/dashain.jpg",
    description_en: [
      "Pashupatinath Temple is one of the holiest Hindu temples in the world.",
      "Located on the banks of the Bagmati River, it is a major pilgrimage site and a center of Hindu culture."
    ],
    description_np: [
      "पशुपतिनाथ मन्दिर विश्वकै पवित्र हिन्दू मन्दिरहरूमध्ये एक हो।",
      "बागमती नदीको किनारमा अवस्थित यो मन्दिर हिन्दू संस्कृतिको महत्वपूर्ण केन्द्र र तीर्थस्थल हो।"
    ],
    images: [
      "/images/pashupatinath.jpg",
      "/images/pashupatinath2.jpg"
    ],
    location: { lat: 27.7105, lng: 85.3489 }
  },
  {
    id: "lumbini",
    category: "province",
    title_en: "Lumbini",
    title_np: "लुम्बिनी",
    video_url: "/images/videos/lumbini.mp4",
    thumbnail: "/images/patan.jpg",
    description_en: [
      "Lumbini is the birthplace of Lord Buddha and one of the most significant spiritual sites in the world.",
      "The sacred gardens of Lumbini, Maya Devi Temple, and surrounding monasteries attract thousands of visitors every year."
    ],
    description_np: [
      "लुम्बिनी भगवान बुद्धको जन्मस्थल र विश्वको सबैभन्दा महत्वपूर्ण आध्यात्मिक स्थलहरूमध्ये एक हो।",
      "पवित्र बगैंचा, मायादेवी मन्दिर र वरिपरि रहेका गुम्बाहरूले हरेक वर्ष हजारौं तीर्थयात्रीलाई आकर्षित गर्छन्।"
    ],
    images: [
      "/images/patan.jpg",
      "/images/lumbini2.jpg"
    ],
    location: { lat: 27.6792, lng: 83.5070 }
  },
  {
    id: "kathmandu",
    category: "province",
    title_en: "Kathmandu Valley",
    title_np: "काठमाडौँ उपत्यका",
    video_url: "/images/videos/kathmandu.mp4",
    thumbnail: "/images/kathmandu-thumbnail.jpg",
    description_en: [
      "Kathmandu Valley is rich in history and culture, containing seven UNESCO World Heritage Sites.",
      "Swayambhunath, Pashupatinath, Boudhanath, and Patan Durbar Square reflect the glorious past of Nepal."
    ],
    description_np: [
      "काठमाडौँ उपत्यका इतिहास र संस्कृतिले भरिएको छ, यहाँ सात वटा युनेस्को विश्व सम्पदा स्थलहरू रहेका छन्।",
      "स्वयम्भूनाथ, पशुपतिनाथ, बौद्धनाथ र पाटन दरबार स्क्वायर नेपालका गौरवशाली इतिहास झल्काउँछन्।"
    ],
    images: [
      "/images/kathmandu1.jpg",
      "/images/kathmandu2.jpg"
    ],
    location: { lat: 27.7172, lng: 85.3240 }
  },
  {
    id: "pashupatinath",
    category: "province",
    title_en: "Pashupatinath Temple",
    title_np: "पशुपतिनाथ मन्दिर",
    video_url: "/images/videos/pashupatinath.mp4",
    thumbnail: "/images/dashain.jpg",
    description_en: [
      "Pashupatinath Temple is one of the holiest Hindu temples in the world.",
      "Located on the banks of the Bagmati River, it is a major pilgrimage site and a center of Hindu culture."
    ],
    description_np: [
      "पशुपतिनाथ मन्दिर विश्वकै पवित्र हिन्दू मन्दिरहरूमध्ये एक हो।",
      "बागमती नदीको किनारमा अवस्थित यो मन्दिर हिन्दू संस्कृतिको महत्वपूर्ण केन्द्र र तीर्थस्थल हो।"
    ],
    images: [
      "/images/pashupatinath.jpg",
      "/images/pashupatinath2.jpg"
    ],
    location: { lat: 27.7105, lng: 85.3489 }
  }
];

