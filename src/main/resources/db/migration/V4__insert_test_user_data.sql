-- Migration script to populate Test User's resume data
-- This script creates a test user account for production testing

-- Insert Test User as a test account (password: test123)
INSERT INTO users (username, password, email, first_name, last_name, created_at, updated_at, is_active)
VALUES (
    'testuser',
    '$2a$12$kmxye/wOil5wSEiQGDRYIettWwwVX9O42mxQbb1KpffwMmDmQcGZG', -- test123
    'test.user@example.com',
    'Test',
    'User',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true
);

-- Use a DO block to handle variables in PostgreSQL
DO $$
DECLARE
    test_user_id BIGINT;
    exp1_id BIGINT;
    exp2_id BIGINT;
    proj1_id BIGINT;
    proj2_id BIGINT;
    proj3_id BIGINT;
BEGIN
    -- Get the user ID for Test User
    SELECT id INTO test_user_id FROM users WHERE username = 'testuser';

    -- Insert Personal Information
    INSERT INTO personal_info (user_id, name, email, phone, location, linkedin, portfolio, created_at, updated_at)
    VALUES (
        test_user_id,
        'Test User',
        'test.user@example.com',
        '(555) 123-4567',
        'San Francisco, CA',
        'testuser-linkedin',
        'testuser-portfolio.com',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Insert Experiences
    -- Experience 1: Frontend Developer
    INSERT INTO experiences (user_id, title, company, location, date_range, description, priority, created_at, updated_at)
    VALUES (
        test_user_id,
        'Frontend Developer',
        'TechCorp Inc.',
        'San Francisco, CA',
        'Jan 2023--Present',
        'Developed responsive web applications using modern JavaScript frameworks and collaborated with design teams.',
        10,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO exp1_id;

    -- Insert bullets for Experience 1
    INSERT INTO experience_bullets (experience_id, bullet_text, order_index, created_at) VALUES
    (exp1_id, 'Built responsive web applications using React.js and TypeScript, improving user engagement by 25% through enhanced UI/UX design.', 1, CURRENT_TIMESTAMP),
    (exp1_id, 'Collaborated with cross-functional teams to implement new features and optimize application performance, reducing load times by 40%.', 2, CURRENT_TIMESTAMP),
    (exp1_id, 'Mentored junior developers and conducted code reviews, maintaining high code quality standards across the team.', 3, CURRENT_TIMESTAMP);

    -- Insert technologies for Experience 1
    INSERT INTO experience_technologies (experience_id, technology, created_at) VALUES
    (exp1_id, 'React.js', CURRENT_TIMESTAMP),
    (exp1_id, 'TypeScript', CURRENT_TIMESTAMP),
    (exp1_id, 'JavaScript', CURRENT_TIMESTAMP),
    (exp1_id, 'HTML5', CURRENT_TIMESTAMP),
    (exp1_id, 'CSS3', CURRENT_TIMESTAMP),
    (exp1_id, 'Git', CURRENT_TIMESTAMP),
    (exp1_id, 'REST APIs', CURRENT_TIMESTAMP);

    -- Experience 2: Junior Developer
    INSERT INTO experiences (user_id, title, company, location, date_range, description, priority, created_at, updated_at)
    VALUES (
        test_user_id,
        'Junior Developer',
        'StartupXYZ',
        'Austin, TX',
        'Jun 2022--Dec 2022',
        'Contributed to full-stack development projects and learned modern web technologies.',
        9,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO exp2_id;

    -- Insert bullets for Experience 2
    INSERT INTO experience_bullets (experience_id, bullet_text, order_index, created_at) VALUES
    (exp2_id, 'Developed and maintained web applications using Node.js and Express.js, handling both frontend and backend responsibilities.', 1, CURRENT_TIMESTAMP),
    (exp2_id, 'Implemented database solutions using MongoDB and MySQL, ensuring data integrity and optimal query performance.', 2, CURRENT_TIMESTAMP),
    (exp2_id, 'Participated in agile development processes, including sprint planning, daily standups, and retrospective meetings.', 3, CURRENT_TIMESTAMP);

    -- Insert technologies for Experience 2
    INSERT INTO experience_technologies (experience_id, technology, created_at) VALUES
    (exp2_id, 'Node.js', CURRENT_TIMESTAMP),
    (exp2_id, 'Express.js', CURRENT_TIMESTAMP),
    (exp2_id, 'MongoDB', CURRENT_TIMESTAMP),
    (exp2_id, 'MySQL', CURRENT_TIMESTAMP),
    (exp2_id, 'JavaScript', CURRENT_TIMESTAMP),
    (exp2_id, 'Agile', CURRENT_TIMESTAMP);

    -- Insert Projects
    -- Project 1: E-commerce Platform
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        test_user_id,
        'E-commerce Platform',
        'React, Node.js, MongoDB, Stripe',
        'https://github.com/testuser/ecommerce-platform',
        10,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj1_id;

    -- Insert bullets for Project 1
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj1_id, 'Built a full-stack e-commerce platform with user authentication, product catalog, shopping cart, and payment integration using Stripe.', 1, CURRENT_TIMESTAMP),
    (proj1_id, 'Implemented responsive design ensuring optimal user experience across desktop, tablet, and mobile devices.', 2, CURRENT_TIMESTAMP),
    (proj1_id, 'Integrated real-time inventory management and order tracking system for seamless customer experience.', 3, CURRENT_TIMESTAMP);

    -- Project 2: Task Management App
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        test_user_id,
        'Task Management App',
        'React, TypeScript, Firebase',
        'https://github.com/testuser/task-manager',
        9,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj2_id;

    -- Insert bullets for Project 2
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj2_id, 'Developed a collaborative task management application with real-time updates, user authentication, and team collaboration features.', 1, CURRENT_TIMESTAMP),
    (proj2_id, 'Implemented drag-and-drop functionality for task organization and priority management.', 2, CURRENT_TIMESTAMP),
    (proj2_id, 'Added data visualization features including progress charts and productivity analytics.', 3, CURRENT_TIMESTAMP);

    -- Project 3: Weather Dashboard
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        test_user_id,
        'Weather Dashboard',
        'React, OpenWeather API, Chart.js',
        'https://github.com/testuser/weather-dashboard',
        8,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj3_id;

    -- Insert bullets for Project 3
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj3_id, 'Created a weather dashboard that displays current conditions and 7-day forecasts for multiple cities.', 1, CURRENT_TIMESTAMP),
    (proj3_id, 'Integrated OpenWeather API for real-time weather data and implemented location-based weather alerts.', 2, CURRENT_TIMESTAMP),
    (proj3_id, 'Built interactive charts and graphs to visualize weather patterns and historical data.', 3, CURRENT_TIMESTAMP);

    -- Insert Education
    INSERT INTO education (user_id, degree, institution, date_range, gpa, location, created_at, updated_at) VALUES
    (test_user_id, 'Bachelor of Science in Computer Science', 'University of California, Berkeley', '2018-2022', '3.8', 'Berkeley, CA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (test_user_id, 'Associate Degree in Web Development', 'Community College of San Francisco', '2016-2018', '3.9', 'San Francisco, CA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    -- Insert Skills
    INSERT INTO skills (user_id, category, skill_name, order_index, created_at) VALUES
    -- Programming Languages
    (test_user_id, 'Programming Languages', 'JavaScript', 1, CURRENT_TIMESTAMP),
    (test_user_id, 'Programming Languages', 'TypeScript', 2, CURRENT_TIMESTAMP),
    (test_user_id, 'Programming Languages', 'Python', 3, CURRENT_TIMESTAMP),
    (test_user_id, 'Programming Languages', 'Java', 4, CURRENT_TIMESTAMP),
    
    -- Frontend Technologies
    (test_user_id, 'Frontend Technologies', 'React.js', 1, CURRENT_TIMESTAMP),
    (test_user_id, 'Frontend Technologies', 'Vue.js', 2, CURRENT_TIMESTAMP),
    (test_user_id, 'Frontend Technologies', 'HTML5', 3, CURRENT_TIMESTAMP),
    (test_user_id, 'Frontend Technologies', 'CSS3', 4, CURRENT_TIMESTAMP),
    (test_user_id, 'Frontend Technologies', 'Sass/SCSS', 5, CURRENT_TIMESTAMP),
    
    -- Backend Technologies
    (test_user_id, 'Backend Technologies', 'Node.js', 1, CURRENT_TIMESTAMP),
    (test_user_id, 'Backend Technologies', 'Express.js', 2, CURRENT_TIMESTAMP),
    (test_user_id, 'Backend Technologies', 'Django', 3, CURRENT_TIMESTAMP),
    (test_user_id, 'Backend Technologies', 'Spring Boot', 4, CURRENT_TIMESTAMP),
    
    -- Databases
    (test_user_id, 'Databases', 'MongoDB', 1, CURRENT_TIMESTAMP),
    (test_user_id, 'Databases', 'PostgreSQL', 2, CURRENT_TIMESTAMP),
    (test_user_id, 'Databases', 'MySQL', 3, CURRENT_TIMESTAMP),
    (test_user_id, 'Databases', 'Redis', 4, CURRENT_TIMESTAMP),
    
    -- Tools & Technologies
    (test_user_id, 'Tools & Technologies', 'Git', 1, CURRENT_TIMESTAMP),
    (test_user_id, 'Tools & Technologies', 'Docker', 2, CURRENT_TIMESTAMP),
    (test_user_id, 'Tools & Technologies', 'AWS', 3, CURRENT_TIMESTAMP),
    (test_user_id, 'Tools & Technologies', 'Firebase', 4, CURRENT_TIMESTAMP),
    (test_user_id, 'Tools & Technologies', 'Jenkins', 5, CURRENT_TIMESTAMP);

    -- Insert Certifications
    INSERT INTO certifications (user_id, name, issuer, date_obtained, link, created_at, updated_at) VALUES
    (test_user_id, 'AWS Certified Developer Associate', 'Amazon Web Services', '2023-06-15', 'https://aws.amazon.com/certification/', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (test_user_id, 'MongoDB Certified Developer', 'MongoDB University', '2023-03-20', 'https://university.mongodb.com/', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (test_user_id, 'React Developer Certification', 'Meta', '2022-11-10', 'https://www.meta.com/', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

END $$; 