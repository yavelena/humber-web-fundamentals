/****** FADE IN EFFECT ********/

const observer = new IntersectionObserver(
    (entries) =>
    {
        entries.forEach((entry) =>
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

function attachFadeObserver()
{
    const fadeItems = document.querySelectorAll(".fade-in:not(.is-visible)");

    fadeItems.forEach((item) =>
    {
        observer.observe(item);
    });
}



/****** PROJECTS SEARCH ********/

const projectsContainer = document.querySelector("#projects-container");

const searchInput = document.querySelector("#project-search-input");
const searchButton = document.querySelector("#project-search-btn");

let myProjects = [];

function createProjectCard(project) {
    const techsHtml = project.techs.map(tech => `<span>${tech}</span>`).join("");

    return `
        <article class="project-card flex-col fade-in" style="--delay: 0.12s;">
            <img src="${project.image}" alt="${project.alt}"/>
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
        projectsContainer.innerHTML = `
            <p><b>No matching projects found.</b><br/>
            Try another keyword or reset the search to view the full repository.</p>
        `;
        return;
    }

    projectsContainer.innerHTML = projects.map(createProjectCard).join("");
    attachFadeObserver();
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

const handleSearch = () =>
{
    const searchText = searchInput.value;
    const filteredProjects = filterProjects(searchText);
    renderProjects(filteredProjects);
}

function renderLoadError()
{
    projectsContainer.innerHTML = `
        <div class="projects-empty-state fade-in is-visible">
            <span class="projects-empty-state__label">[LOAD_ERROR]</span>
            <h3>Unable to load projects.</h3>
            <p>Please check the JSON file path and try again.</p>
        </div>
    `;
}

async function loadProjects() {
    try {
        const response = await fetch("data/projects.json");  
        console.log("Fetching projects data from JSON...");
        if (!response.ok) {
            throw new Error(`HTTP data load error! status: ${response.status}`);
        }
        myProjects = await response.json();
        console.log("Projects data loaded successfully:", myProjects);
        renderProjects(myProjects);
    } catch (error) {
        console.error("Error loading projects:", error);
        renderLoadError();
    }
}


searchInput.addEventListener("input", handleSearch);
searchButton.addEventListener("click", handleSearch);

loadProjects();

attachFadeObserver();


