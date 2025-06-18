import React, { useState } from 'react';
import './CulturalHeritage.css';

const heritageSites = [
  {
    id: 1,
    name: 'Swayambhunath Stupa',
    image: '/images/swayambhunath.jpg',
    shortDescription: 'A sacred Buddhist site known as the Monkey Temple.',
    history: 'Swayambhunath is one of the oldest religious sites in Nepal. It is believed to have been established around the 5th century AD. The stupa is a UNESCO World Heritage Site and is an important pilgrimage site for Buddhists. The site is also known for its monkeys, which are considered sacred by locals. It offers panoramic views of the Kathmandu Valley. The stupa is adorned with colorful prayer flags and intricate carvings, making it a significant cultural landmark. A major restoration project was undertaken in 2010 to preserve its historical integrity. The site attracts millions of visitors each year, making it a significant cultural and historical site in Nepal. It is also a symbol of peace and harmony among different religions in the region. Swayambhunath is often associated with various legends, including one that states it was formed from a lotus flower that bloomed in the middle of a lake. The stupa is surrounded by numerous small stupas, shrines, and monasteries, adding to its spiritual significance. The site is also a popular spot for meditation and reflection, attracting both locals and tourists.',
    location: 'Kathmandu, Nepal',
    entryFee: 'NRs. 200 for SAARC nationals, NRs. 1000 for others',
    gallery: ['/images/swayambhunath.jpg', '/images/swayambhunath2.jpg']
  },
  {
    id: 2,
    name: 'Patan Durbar Square',
    image: '/images/patan.jpg',
    shortDescription: 'Historic palace with Newari architecture.',
    history: 'Patan Durbar Square is a marvel of Newar architecture...',
    location: 'Lalitpur, Nepal',
    entryFee: 'NRs. 250 for SAARC, NRs. 1000 for foreigners',
    gallery: ['/images/patan.jpg', '/images/patan2.jpg']
  },
  {
    id: 3,
    name: 'Bhaktapur Durbar Square',
    image: '/images/bhaktapur.jpg',
    shortDescription: 'A UNESCO site showcasing ancient architecture.',
    history: 'Bhaktapur Durbar Square includes palaces, courtyards, temples...',
    location: 'Bhaktapur, Nepal',
    entryFee: 'NRs. 1500 for foreigners',
    gallery: ['/images/bhaktapur.jpg', '/images/bhaktapur2.jpg']
  },
    {
    id: 1,
    name: 'Swayambhunath Stupa',
    image: '/images/swayambhunath.jpg',
    shortDescription: 'A sacred Buddhist site known as the Monkey Temple.',
    history: 'Swayambhunath is one of the oldest religious sites in Nepal. It is believed to have been established around the 5th century AD. The stupa is a UNESCO World Heritage Site and is an important pilgrimage site for Buddhists. The site is also known for its monkeys, which are considered sacred by locals. It offers panoramic views of the Kathmandu Valley. The stupa is adorned with colorful prayer flags and intricate carvings, making it a significant cultural landmark. A major restoration project was undertaken in 2010 to preserve its historical integrity. The site attracts millions of visitors each year, making it a significant cultural and historical site in Nepal. It is also a symbol of peace and harmony among different religions in the region. Swayambhunath is often associated with various legends, including one that states it was formed from a lotus flower that bloomed in the middle of a lake. The stupa is surrounded by numerous small stupas, shrines, and monasteries, adding to its spiritual significance. The site is also a popular spot for meditation and reflection, attracting both locals and tourists.',
    location: 'Kathmandu, Nepal',
    entryFee: 'NRs. 200 for SAARC nationals, NRs. 1000 for others',
    gallery: ['/images/swayambhunath.jpg', '/images/swayambhunath2.jpg']
  },
    {
    id: 1,
    name: 'Swayambhunath Stupa',
    image: '/images/swayambhunath.jpg',
    shortDescription: 'A sacred Buddhist site known as the Monkey Temple.',
    history: 'Swayambhunath is one of the oldest religious sites in Nepal. It is believed to have been established around the 5th century AD. The stupa is a UNESCO World Heritage Site and is an important pilgrimage site for Buddhists. The site is also known for its monkeys, which are considered sacred by locals. It offers panoramic views of the Kathmandu Valley. The stupa is adorned with colorful prayer flags and intricate carvings, making it a significant cultural landmark. A major restoration project was undertaken in 2010 to preserve its historical integrity. The site attracts millions of visitors each year, making it a significant cultural and historical site in Nepal. It is also a symbol of peace and harmony among different religions in the region. Swayambhunath is often associated with various legends, including one that states it was formed from a lotus flower that bloomed in the middle of a lake. The stupa is surrounded by numerous small stupas, shrines, and monasteries, adding to its spiritual significance. The site is also a popular spot for meditation and reflection, attracting both locals and tourists.',
    location: 'Kathmandu, Nepal',
    entryFee: 'NRs. 200 for SAARC nationals, NRs. 1000 for others',
    gallery: ['/images/swayambhunath.jpg', '/images/swayambhunath2.jpg']
  },
  {
    id: 4,
    name: 'Pashupatinath Temple',
    image: '/images/pashupatinath.jpg',
    shortDescription: 'One of the holiest Hindu temples of Shiva.',
    history: 'Pashupatinath was designated as a UNESCO World Heritage Site in 1979...',
    location: 'Kathmandu, Nepal',
    entryFee: 'NRs. 1000 for foreigners',
    gallery: ['/images/pashupatinath.jpg', '/images/pashupatinath2.jpg']
  }
];

const CulturalHeritage = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  return (
    <div className="heritage-container">
      <h2 className="heritage-title">Cultural Heritage Sites of Nepal</h2>

      <div className="heritage-grid">
        {heritageSites.map(site => (
          <div
            key={site.id}
            className="heritage-card"
            onClick={() => setSelectedSite(site)}
          >
            <img src={site.image} alt={site.name} />
            <h3>{site.name}</h3>
            <p>{site.shortDescription}</p>
            <button className="read-more-btn">Read More</button>
          </div>
        ))}
      </div>

      {/* Modal for selected site */}
      {selectedSite && (
        <div className="heritage-modal">
          <div className="heritage-modal-content large">
            <button className="close-btn" onClick={() => setSelectedSite(null)}>&larr; Back</button>
            <h2>{selectedSite.name}</h2>
            <p><strong>Location:</strong> {selectedSite.location}</p>
            <p><strong>Entry Fee:</strong> {selectedSite.entryFee}</p>
            <p><strong>History:</strong> {selectedSite.history}</p>

            <div className="heritage-gallery">
              <h4>Gallery:</h4>
              <div className="gallery-images">
                {selectedSite.gallery.map((img, idx) => (
                  <img key={idx} src={img} alt={`${selectedSite.name} ${idx}`} onClick={() => setFullscreenImg(img)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview */}
      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen view" />
        </div>
      )}
    </div>
  );
};

export default CulturalHeritage;
