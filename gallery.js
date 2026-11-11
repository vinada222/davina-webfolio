const fallbackProject = {
  title: "Computer Students' Society (CSS)",
  desc: "School Organization multimedia works, creating publication materials, promotional content, merchandise, and visual assets.",
  category: "Multimedia & Graphic Works",
  panelEyebrow: "SCHOOL ORGANIZATION WORKS",
  panelHeading: "School Publication Materials, Mockups, & Posters"
};

function getGalleryProject(){
  const rawProject = sessionStorage.getItem('galleryProject');
  if (!rawProject) return fallbackProject;

  try {
    const project = JSON.parse(rawProject);
    if (!project || typeof project !== 'object') return fallbackProject;
    return { ...fallbackProject, ...project };
  } catch (error) {
    console.error('Could not read the selected project gallery.', error);
    return fallbackProject;
  }
}

const project = getGalleryProject();
const darkThemeToggle = document.getElementById('darkThemeToggle');
const lightThemeToggle = document.getElementById('lightThemeToggle');

function applyTheme(mode){
  const isLight = mode === 'light';
  document.body.classList.toggle('light-mode', isLight);
  darkThemeToggle.classList.toggle('active', !isLight);
  lightThemeToggle.classList.toggle('active', isLight);
  darkThemeToggle.setAttribute('aria-pressed', String(!isLight));
  lightThemeToggle.setAttribute('aria-pressed', String(isLight));
  try {
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  } catch (error) {
    console.error('Could not save the selected color theme.', error);
  }
}

darkThemeToggle.addEventListener('click', () => applyTheme('dark'));
lightThemeToggle.addEventListener('click', () => applyTheme('light'));

let savedTheme = 'dark';
try {
  savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
} catch (error) {
  console.error('Could not read the saved color theme.', error);
}
applyTheme(savedTheme);

document.title = `${project.title} | Davina's Art`;
document.getElementById('galleryEyebrow').textContent = project.panelEyebrow;
document.getElementById('galleryHeading').textContent = project.panelHeading || project.title;
document.getElementById('galleryDesc').textContent = project.desc || '';
document.getElementById('galleryProjectTitle').textContent = project.title.toUpperCase();

const category = document.getElementById('galleryCategory');
if (project.category){
  category.textContent = project.category;
} else {
  category.hidden = true;
}

const galleryGrid = document.getElementById('galleryGrid');
const artworkPhotoSets = [
  [
    { src: './photos/VisitBooth1.png', alt: 'Visit Our Booth poster for the Computer Students’ Society' },
    { src: './photos/VisitBooth2.png', alt: 'Activities poster for the Computer Students’ Society booth' }
  ],
  [
    { src: './photos/AKWE1.png', alt: 'Acquaintance Party dress code poster' },
    { src: './photos/AKWE2.png', alt: 'Acquaintance Party dress code guidelines poster' }
  ],
  [
    { src: './photos/AKWE3.png', alt: 'Acquaintance Party poster' }
  ]
];

let activePhotos = artworkPhotoSets[0];

function openPhotoViewer(index, trigger, photos){
  activePhotos = photos;
  showPhoto(index);
  if (!photoLightbox.open) photoLightbox.showModal();
  lastPhotoTrigger = trigger;
}

for (let index = 1; index <= 4; index += 1){
  const card = document.createElement('article');
  card.className = 'gallery-item';

  if (index <= artworkPhotoSets.length){
    const photos = artworkPhotoSets[index - 1];
    if (photos.length === 1){
      card.classList.add('gallery-single');
      const button = document.createElement('button');
      button.className = 'gallery-single-photo';
      button.type = 'button';
      button.setAttribute('aria-label', `View Artwork ${String(index).padStart(2, '0')}: ${photos[0].alt}`);

      const image = document.createElement('img');
      image.src = photos[0].src;
      image.alt = '';
      image.loading = 'lazy';
      button.appendChild(image);
      button.addEventListener('click', () => openPhotoViewer(0, button, photos));
      card.appendChild(button);
    } else {
      card.classList.add('gallery-folder');
      const stage = document.createElement('div');
      stage.className = 'folder-stage';
      photos.forEach((photo, photoIndex) => {
        const button = document.createElement('button');
        button.className = `folder-photo folder-photo-${photoIndex + 1}`;
        button.type = 'button';
        button.setAttribute('aria-label', `View Artwork ${String(index).padStart(2, '0')}, photo ${photoIndex + 1}: ${photo.alt}`);

        const image = document.createElement('img');
        image.src = photo.src;
        image.alt = '';
        image.loading = 'lazy';
        button.appendChild(image);
        button.addEventListener('click', () => openPhotoViewer(photoIndex, button, photos));
        stage.appendChild(button);
      });

      card.appendChild(stage);
    }
  } else {
    const placeholder = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = `Artwork ${String(index).padStart(2, '0')}`;
    placeholder.append(title, document.createTextNode('Image coming soon'));
    card.appendChild(placeholder);
  }

  galleryGrid.appendChild(card);
}

const photoLightbox = document.getElementById('photoLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxViewer = document.getElementById('lightboxViewer');
let currentPhoto = 0;
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let pointerStart = null;
let draggedImage = false;
let lastPhotoTrigger = null;

function updateZoom(){
  lightboxImage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  lightboxImage.style.cursor = zoomLevel > 1 ? 'zoom-out' : 'zoom-in';
}

function showPhoto(index){
  currentPhoto = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[currentPhoto];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCounter.textContent = `Photo ${currentPhoto + 1} of ${activePhotos.length}`;
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  updateZoom();
}

function changeZoom(amount){
  zoomLevel = Math.min(4, Math.max(1, zoomLevel + amount));
  if (zoomLevel === 1){
    panX = 0;
    panY = 0;
  }
  updateZoom();
}

document.getElementById('previousPhoto').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.getElementById('nextPhoto').addEventListener('click', () => showPhoto(currentPhoto + 1));
document.getElementById('closeLightbox').addEventListener('click', () => photoLightbox.close());

photoLightbox.addEventListener('close', () => {
  if (lastPhotoTrigger?.isConnected) lastPhotoTrigger.focus();
});
photoLightbox.addEventListener('click', event => {
  if (event.target === photoLightbox) photoLightbox.close();
});
photoLightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft'){
    event.preventDefault();
    showPhoto(currentPhoto - 1);
  } else if (event.key === 'ArrowRight'){
    event.preventDefault();
    showPhoto(currentPhoto + 1);
  }
});

lightboxViewer.addEventListener('wheel', event => {
  event.preventDefault();
  changeZoom(event.deltaY < 0 ? 0.25 : -0.25);
}, { passive: false });

lightboxImage.addEventListener('click', () => {
  if (draggedImage){
    draggedImage = false;
    return;
  }
  if (zoomLevel > 1){
    zoomLevel = 1;
    panX = 0;
    panY = 0;
  } else {
    zoomLevel = 2;
  }
  updateZoom();
});

lightboxViewer.addEventListener('pointerdown', event => {
  pointerStart = { x: event.clientX, y: event.clientY, panX, panY };
  draggedImage = false;
  if (zoomLevel > 1 && event.pointerType === 'mouse' && lightboxImage.contains(event.target)){
    lightboxImage.setPointerCapture(event.pointerId);
    lightboxImage.style.cursor = 'grabbing';
  }
});
lightboxViewer.addEventListener('pointermove', event => {
  if (!pointerStart) return;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3){
    draggedImage = true;
  }
  if (zoomLevel > 1 && lightboxImage.hasPointerCapture(event.pointerId)){
    panX = pointerStart.panX + deltaX;
    panY = pointerStart.panY + deltaY;
    updateZoom();
    lightboxImage.style.cursor = 'grabbing';
  }
});
lightboxViewer.addEventListener('pointerup', event => {
  if (!pointerStart) return;
  const deltaX = event.clientX - pointerStart.x;
  if (zoomLevel === 1 && Math.abs(deltaX) > 55){
    showPhoto(currentPhoto + (deltaX < 0 ? 1 : -1));
  }
  pointerStart = null;
  if (zoomLevel > 1) updateZoom();
});
