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
for (let index = 1; index <= 4; index += 1){
  const card = document.createElement('article');
  card.className = 'gallery-item';
  card.innerHTML = `<span><strong>Artwork ${String(index).padStart(2, '0')}</strong>Image coming soon</span>`;
  galleryGrid.appendChild(card);
}
