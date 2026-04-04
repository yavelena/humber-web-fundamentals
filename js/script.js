const projectsContainer = document.querySelector("#projects-container");

const searchInput = document.querySelector("#project-search-input");
const searchButton = document.querySelector("#project-search-btn");


function createProjectCard(project) {
    const techsHtml = project.techs.map(tech => `<span>${tech}</span>`).join("");

    return `
        <article class="project-card flex-col">
            <img src="${project.image}" alt="${project.alt}" />
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p class="project-techs">${techsHtml}</p>
            <p class="project-role">Role: ${project.role} • <span class="year">${project.year}</span></p>
            <a href="${project.link}" class="button">VIEW PROJECT →</a>
        </article>
    `;
}


function renderProjects(projects) {
    if (projects.length === 0) {
        projectsContainer.innerHTML = `<p class="no-projects">No projects found.</p>`;
        return;
    }

    projectsContainer.innerHTML = projects.map(createProjectCard).join("");
}


function filterProjects(searchText) {
    //console.log("Filtering projects with search text:", searchText);

    const query = searchText.trim().toLowerCase();
    
    if (query === "") {
        return myProjects; // Return all projects if search is empty
    }

    return myProjects.filter(project => 
       {
            const searchableText = `
                ${project.title}
                ${project.description}
                ${project.role}
                ${project.year}
                ${project.techs.join(" ")}
            `.toLowerCase();
            return searchableText.includes(query);
       }
    );
}

const Search = () =>
{
    const searchText = searchInput.value;
    const filteredProjects = filterProjects(searchText);
    renderProjects(filteredProjects);
}

searchInput.addEventListener("input", Search);
searchButton.addEventListener("click", Search);

renderProjects(myProjects);