// Main JavaScript for Portfolio

// GitHub Projects Configuration
const GITHUB_USERNAME = 'onasiscart';
// List of projects to highlight/show specifically, as requested
const FEATURED_PROJECTS = [
    'Catalonia_Connected_project',
    'Liver_Disease_Classification',
    'Data_Warehousing_Aviation_Analytics',
    'bluesky-report-AP2'
];

// Map language colors manually since GitHub API doesn't provide them directly without extra calls
const LANGUAGE_COLORS = {
    'Python': '#3572A5',
    'JavaScript': '#f1e05a',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Jupyter Notebook': '#DA5B0B',
    'TypeScript': '#2b7489'
};

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    initSmoothScroll();
});

async function fetchProjects() {
    const projectsGrid = document.getElementById('projects-grid');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        if (!response.ok) throw new Error('Failed to fetch repositories');

        let repos = await response.json();

        // Filter and Sort:
        // 1. Include specific featured projects OR high-star projects
        // 2. Sort so featured ones are first

        const featuredRepos = [];
        const otherRepos = [];

        repos.forEach(repo => {
            if (FEATURED_PROJECTS.includes(repo.name)) {
                featuredRepos.push(repo);
            } else if (!repo.fork && repo.stargazers_count > 0) {
                // Also include other non-fork repos that have stars
                otherRepos.push(repo);
            }
        });

        // Custom sort for featured repos to match list order roughly
        featuredRepos.sort((a, b) => {
            return FEATURED_PROJECTS.indexOf(a.name) - FEATURED_PROJECTS.indexOf(b.name);
        });

        // Combine (Featured first, then others)
        const displayRepos = [...featuredRepos, ...otherRepos];

        projectsGrid.innerHTML = '';

        if (displayRepos.length === 0) {
            projectsGrid.innerHTML = '<p>No projects found to display.</p>';
            return;
        }

        displayRepos.forEach(repo => {
            const card = createProjectCard(repo);
            projectsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        projectsGrid.innerHTML = `
            <div class="error-msg">
                <p>Could not load projects from GitHub. Please check back later.</p>
                <p><small>${error.message}</small></p>
            </div>
        `;
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';

    // Fallback description if null
    const description = repo.description || 'No description available.';

    // Language color
    const langColor = LANGUAGE_COLORS[repo.language] || '#cccccc';

    card.innerHTML = `
        <div class="repo-header">
            <i class="fa-regular fa-folder-open"></i>
            <a href="${repo.html_url}" target="_blank" aria-label="View Source"><i class="fa-brands fa-github"></i></a>
        </div>
        <a href="${repo.html_url}" target="_blank" style="text-decoration:none">
            <h3 class="repo-title">${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
        </a>
        <p class="repo-description">${description}</p>
        <div class="repo-stats">
            ${repo.language ? `<span><span class="language-dot" style="background-color: ${langColor}"></span>${repo.language}</span>` : ''}
            <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count}</span>
            <span><i class="fa-solid fa-code-branch"></i> ${repo.forks_count}</span>
        </div>
    `;

    return card;
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}
