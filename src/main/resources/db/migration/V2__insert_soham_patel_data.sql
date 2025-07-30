-- Migration script to populate Soham Patel's resume data
-- This script creates a default user account and populates all tables with his data

-- Insert Soham Patel as a default user (password: password123)
INSERT INTO users (username, password, email, first_name, last_name, created_at, updated_at, is_active)
VALUES (
    'sohampatel',
    '$2a$10$YIISb0V9QCQpfYlCvba9HOQLhWka.VwfYnqHhN2MMgydCyTddxLda', -- password123
    'sohampatel1117@gmail.com',
    'Soham',
    'Patel',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true
);

-- Use a DO block to handle variables in PostgreSQL
DO $$
DECLARE
    soham_user_id BIGINT;
    exp1_id BIGINT;
    exp2_id BIGINT;
    exp3_id BIGINT;
    proj1_id BIGINT;
    proj2_id BIGINT;
    proj3_id BIGINT;
    proj4_id BIGINT;
    proj5_id BIGINT;
    proj6_id BIGINT;
    proj7_id BIGINT;
    proj8_id BIGINT;
    proj9_id BIGINT;
    proj10_id BIGINT;
    proj11_id BIGINT;
BEGIN
    -- Get the user ID for Soham Patel
    SELECT id INTO soham_user_id FROM users WHERE username = 'sohampatel';

    -- Insert Personal Information
    INSERT INTO personal_info (user_id, name, email, phone, location, linkedin, portfolio, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Soham Patel',
        'sohampatel1117@gmail.com',
        '(984) 296-1080',
        'Dallas, TX',
        'sohampatel1999',
        'sohampatel99.netlify.app',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Insert Experiences
    -- Experience 1: Software Engineer Intern at DRC Systems
    INSERT INTO experiences (user_id, title, company, location, date_range, description, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Software Engineer Intern',
        'DRC Systems',
        'Remote, NJ',
        'May 2024--July 2024',
        'Developed a full-stack financial dashboard using Django and React, with AWS deployment and Docker containerization.',
        10,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO exp1_id;

    -- Insert bullets for Experience 1
    INSERT INTO experience_bullets (experience_id, bullet_text, order_index, created_at) VALUES
    (exp1_id, 'Developed a financial dashboard using Django (Python) for backend logic and React (JavaScript) for the frontend, improving data retrieval performance through optimized PostgreSQL queries and efficient schema design.', 1, CURRENT_TIMESTAMP),
    (exp1_id, 'Migrated the application to AWS, leveraging RDS for PostgreSQL, S3 for storage, and EC2 for backend deployment, resulting in improved scalability and reduced operational overhead compared to on-premise infrastructure.', 2, CURRENT_TIMESTAMP),
    (exp1_id, 'Streamlined deployment by containerizing the application using Docker, enabling faster and more consistent release cycles across environments.', 3, CURRENT_TIMESTAMP);

    -- Insert technologies for Experience 1
    INSERT INTO experience_technologies (experience_id, technology, created_at) VALUES
    (exp1_id, 'Django', CURRENT_TIMESTAMP),
    (exp1_id, 'Python', CURRENT_TIMESTAMP),
    (exp1_id, 'React', CURRENT_TIMESTAMP),
    (exp1_id, 'JavaScript', CURRENT_TIMESTAMP),
    (exp1_id, 'PostgreSQL', CURRENT_TIMESTAMP),
    (exp1_id, 'AWS', CURRENT_TIMESTAMP),
    (exp1_id, 'RDS', CURRENT_TIMESTAMP),
    (exp1_id, 'S3', CURRENT_TIMESTAMP),
    (exp1_id, 'EC2', CURRENT_TIMESTAMP),
    (exp1_id, 'Docker', CURRENT_TIMESTAMP),
    (exp1_id, 'Full-Stack', CURRENT_TIMESTAMP);

    -- Experience 2: Software Engineer at L&T (Senior Engineer period)
    INSERT INTO experiences (user_id, title, company, location, date_range, description, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Senior Engineer',
        'Larsen & Toubro Limited',
        'Mumbai, India',
        'Aug 2022--Jul 2023',
        'Implemented advanced object tracking solutions and real-time systems for defense applications.',
        9,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO exp2_id;

    -- Insert bullets for Experience 2
    INSERT INTO experience_bullets (experience_id, bullet_text, order_index, created_at) VALUES
    (exp2_id, 'Implemented an advanced object tracking solution for the Helo-Landing System on NVIDIA Xavier using YOLOv7, OpenCV, DeepStream, and Python, optimizing coordinate processing logic with ctypes to reduce latency from 12ms to 2ms.', 1, CURRENT_TIMESTAMP),
    (exp2_id, 'Designed and implemented a real-time Combat Management System UI using QML, Qt (C++), integrating radar and electro-optical sensor data via DDS to enable synchronized multi-sensor display and control under tight latency constraints.', 2, CURRENT_TIMESTAMP),
    (exp2_id, 'Developed a high-performance Counter Drone System using Qt (C++), integrating real-time radar data via TCP/UDP socket programming to support synchronized multi-sensor visualization under tight latency requirements.', 3, CURRENT_TIMESTAMP);

    -- Insert technologies for Experience 2
    INSERT INTO experience_technologies (experience_id, technology, created_at) VALUES
    (exp2_id, 'YOLOv7', CURRENT_TIMESTAMP),
    (exp2_id, 'DeepStream', CURRENT_TIMESTAMP),
    (exp2_id, 'Python', CURRENT_TIMESTAMP),
    (exp2_id, 'OpenCV', CURRENT_TIMESTAMP),
    (exp2_id, 'ctypes', CURRENT_TIMESTAMP),
    (exp2_id, 'NVIDIA Xavier', CURRENT_TIMESTAMP),
    (exp2_id, 'QML', CURRENT_TIMESTAMP),
    (exp2_id, 'Qt', CURRENT_TIMESTAMP),
    (exp2_id, 'C++', CURRENT_TIMESTAMP),
    (exp2_id, 'DDS', CURRENT_TIMESTAMP),
    (exp2_id, 'TCP/UDP', CURRENT_TIMESTAMP),
    (exp2_id, 'Computer Vision', CURRENT_TIMESTAMP),
    (exp2_id, 'Real-time Systems', CURRENT_TIMESTAMP);

    -- Experience 3: Graduate Engineer Trainee at L&T
    INSERT INTO experiences (user_id, title, company, location, date_range, description, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Graduate Engineer Trainee',
        'Larsen & Toubro Limited',
        'Mumbai, India',
        'Aug 2021--Jul 2022',
        'Conducted analysis on NIR camera data and implemented CI/CD pipelines for defense projects.',
        8,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO exp3_id;

    -- Insert bullets for Experience 3
    INSERT INTO experience_bullets (experience_id, bullet_text, order_index, created_at) VALUES
    (exp3_id, 'Conducted analysis on NIR camera data for surveillance and updated the bore sighting algorithm, enhancing zoom responsiveness and reducing focus lag using Visual C++ and OpenCV.', 1, CURRENT_TIMESTAMP),
    (exp3_id, 'Provisioned GitLab for version control and CI/CD pipelines, incorporating automated testing for ongoing sensitive projects, streamlining development processes, and refining code quality.', 2, CURRENT_TIMESTAMP),
    (exp3_id, 'Modernized legacy system documentation and ensured security compliance by leveraging Confluence for structured documentation and JIRA for task tracking and project oversight.', 3, CURRENT_TIMESTAMP);

    -- Insert technologies for Experience 3
    INSERT INTO experience_technologies (experience_id, technology, created_at) VALUES
    (exp3_id, 'Visual C++', CURRENT_TIMESTAMP),
    (exp3_id, 'OpenCV', CURRENT_TIMESTAMP),
    (exp3_id, 'GitLab', CURRENT_TIMESTAMP),
    (exp3_id, 'CI/CD', CURRENT_TIMESTAMP),
    (exp3_id, 'Confluence', CURRENT_TIMESTAMP),
    (exp3_id, 'JIRA', CURRENT_TIMESTAMP),
    (exp3_id, 'Automation', CURRENT_TIMESTAMP),
    (exp3_id, 'Documentation', CURRENT_TIMESTAMP);

    -- Insert Projects
    -- Project 1: FarmTrack
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'FarmTrack',
        'Angular 19, Spring Boot, Docker, GitHub Actions, JUnit, Mockito, Cypress, Swagger',
        'https://github.com/Soham1117/farmTrack',
        10,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj1_id;

    -- Insert bullets for Project 1
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj1_id, 'Developed a full-stack MVC animal movement tracking app using Angular 19, Spring Boot, and Docker containerization, with automated CI/CD pipelines using GitHub Actions for streamlined deployments to Docker Hub.', 1, CURRENT_TIMESTAMP),
    (proj1_id, 'Improved app reliability through comprehensive testing (JUnit, Mockito, Cypress) and automated API documentation (Swagger), reducing issue resolution time.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 1
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj1_id, 'Angular', CURRENT_TIMESTAMP),
    (proj1_id, 'Spring Boot', CURRENT_TIMESTAMP),
    (proj1_id, 'Docker', CURRENT_TIMESTAMP),
    (proj1_id, 'GitHub Actions', CURRENT_TIMESTAMP),
    (proj1_id, 'JUnit', CURRENT_TIMESTAMP),
    (proj1_id, 'Mockito', CURRENT_TIMESTAMP),
    (proj1_id, 'Cypress', CURRENT_TIMESTAMP),
    (proj1_id, 'Swagger', CURRENT_TIMESTAMP),
    (proj1_id, 'CI/CD', CURRENT_TIMESTAMP),
    (proj1_id, 'Testing', CURRENT_TIMESTAMP);

    -- Project 2: The Suite Life
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'The Suite Life',
        'Angular, Django, AWS EC2, RDS, S3, JWT',
        'https://thesuitelife.netlify.app/',
        9,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj2_id;

    -- Insert bullets for Project 2
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj2_id, 'Developed a scalable hotel booking web application with an Angular frontend and Django backend, integrating AWS RDS for structured data storage and AWS S3 for media asset management.', 1, CURRENT_TIMESTAMP),
    (proj2_id, 'Deployed backend services on AWS EC2 and implemented secure user authentication using JWT, ensuring reliable access control and a smooth booking experience for concurrent users.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 2
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj2_id, 'Angular', CURRENT_TIMESTAMP),
    (proj2_id, 'Django', CURRENT_TIMESTAMP),
    (proj2_id, 'AWS', CURRENT_TIMESTAMP),
    (proj2_id, 'EC2', CURRENT_TIMESTAMP),
    (proj2_id, 'RDS', CURRENT_TIMESTAMP),
    (proj2_id, 'S3', CURRENT_TIMESTAMP),
    (proj2_id, 'JWT', CURRENT_TIMESTAMP);

    -- Project 3: Dynamic Healing
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Dynamic Healing',
        'React, Tailwind CSS',
        'https://dynamichealing.in/',
        8,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj3_id;

    -- Insert bullets for Project 3
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj3_id, 'Designed and developed a responsive, interactive healthcare-focused commercial website (DynamicHealing) using React and Tailwind CSS, providing an intuitive and modern user experience.', 1, CURRENT_TIMESTAMP),
    (proj3_id, 'Implemented smooth UI animations, optimized layouts, and modular components to enhance user engagement and ensure a responsive, performant interface.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 3
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj3_id, 'React', CURRENT_TIMESTAMP),
    (proj3_id, 'Tailwind CSS', CURRENT_TIMESTAMP),
    (proj3_id, 'Web Design', CURRENT_TIMESTAMP),
    (proj3_id, 'Responsive UI', CURRENT_TIMESTAMP);

    -- Project 4: Stock Price Prediction
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Stock Price Prediction',
        'Python, CNN, Sentiment Analysis, Web Scraping',
        'https://link.springer.com/chapter/10.1007/978-981-19-3571-8_4',
        9,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj4_id;

    -- Insert bullets for Project 4
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj4_id, 'Developed a stock price prediction system combining sentiment analysis from Google and Twitter news with a custom CNN model, outperforming baseline models on RMSE metrics for closing price forecasts.', 1, CURRENT_TIMESTAMP),
    (proj4_id, 'Published the methodology and results in a Springer journal, showcasing a hybrid approach of news scraping and deep learning for financial prediction.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 4
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj4_id, 'Python', CURRENT_TIMESTAMP),
    (proj4_id, 'CNN', CURRENT_TIMESTAMP),
    (proj4_id, 'Sentiment Analysis', CURRENT_TIMESTAMP),
    (proj4_id, 'News Scraper', CURRENT_TIMESTAMP),
    (proj4_id, 'Time Series', CURRENT_TIMESTAMP),
    (proj4_id, 'Springer', CURRENT_TIMESTAMP);

    -- Project 5: Black Friday Sales Analysis
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Black Friday Sales Analysis',
        'Python, XGBoost, Random Forest, Decision Trees, K-Means Clustering, GridSearchCV',
        'https://drive.google.com/file/d/1fBtGXYDB9e8NLfQ_RkvL4LPjt7n423n4/view',
        8,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj5_id;

    -- Insert bullets for Project 5
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj5_id, 'Built a predictive retail analytics pipeline using Python to model customer purchase behavior during Black Friday, improving regression performance by over 35% after tuning XGBoost with GridSearchCV compared to baseline models.', 1, CURRENT_TIMESTAMP),
    (proj5_id, 'Segmented customers using K-Means clustering based on loyalty indicators like total spend, average transaction value, and transaction frequency, enabling targeted marketing and pricing strategies for high-value clusters.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 5
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj5_id, 'Python', CURRENT_TIMESTAMP),
    (proj5_id, 'XGBoost', CURRENT_TIMESTAMP),
    (proj5_id, 'Random Forest', CURRENT_TIMESTAMP),
    (proj5_id, 'Decision Trees', CURRENT_TIMESTAMP),
    (proj5_id, 'K-Means', CURRENT_TIMESTAMP),
    (proj5_id, 'GridSearchCV', CURRENT_TIMESTAMP),
    (proj5_id, 'EDA', CURRENT_TIMESTAMP),
    (proj5_id, 'Regression', CURRENT_TIMESTAMP),
    (proj5_id, 'Retail Analytics', CURRENT_TIMESTAMP);

    -- Project 6: Sentiment Analyzer Web App
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Sentiment Analyzer Web App',
        'Django, TextBlob, Bootstrap, HTML/CSS',
        'https://github.com/amit-99/SE_Project3',
        7,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj6_id;

    -- Insert bullets for Project 6
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj6_id, 'Built a Django-based sentiment analyzer capable of processing text, audio transcripts, image-extracted text, documents, and Amazon product URLs, returning intuitive polarity scores with categorized outputs.', 1, CURRENT_TIMESTAMP),
    (proj6_id, 'Incorporated TextBlob for lightweight NLP and deployed a clean UI with Bootstrap to enable multi-format input and real-time feedback.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 6
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj6_id, 'Django', CURRENT_TIMESTAMP),
    (proj6_id, 'NLP', CURRENT_TIMESTAMP),
    (proj6_id, 'TextBlob', CURRENT_TIMESTAMP),
    (proj6_id, 'Web App', CURRENT_TIMESTAMP),
    (proj6_id, 'Sentiment Analysis', CURRENT_TIMESTAMP);

    -- Project 7: E-Learning Application
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'E-Learning Application',
        'Python, MySQL, HTML, CSS, JavaScript, Bootstrap',
        'https://github.com/Soham1117/elearningApp',
        7,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj7_id;

    -- Insert bullets for Project 7
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj7_id, 'Built a full-stack e-learning platform with Python and MySQL, using DAO design for clean separation of concerns and implementing secure user authentication, course management, and progress tracking.', 1, CURRENT_TIMESTAMP),
    (proj7_id, 'Designed a responsive frontend with HTML, CSS, and Bootstrap, and implemented a normalized relational schema with indexing and data validation for performance and integrity.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 7
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj7_id, 'Python', CURRENT_TIMESTAMP),
    (proj7_id, 'MySQL', CURRENT_TIMESTAMP),
    (proj7_id, 'HTML', CURRENT_TIMESTAMP),
    (proj7_id, 'CSS', CURRENT_TIMESTAMP),
    (proj7_id, 'JavaScript', CURRENT_TIMESTAMP),
    (proj7_id, 'Bootstrap', CURRENT_TIMESTAMP),
    (proj7_id, 'OOP', CURRENT_TIMESTAMP),
    (proj7_id, 'Database Design', CURRENT_TIMESTAMP);

    -- Project 8: Boid Simulation
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Boid Simulation',
        'C++, SFML',
        '',
        6,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj8_id;

    -- Insert bullets for Project 8
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj8_id, 'Implemented a real-time boid simulation in C++ using SFML, modeling flocking behavior through separation, alignment, and cohesion rules inspired by Craig Reynolds'' algorithm.', 1, CURRENT_TIMESTAMP),
    (proj8_id, 'Optimized vector-based motion logic and interactive rendering to demonstrate scalable autonomous agent behavior in a visually engaging environment.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 8
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj8_id, 'C++', CURRENT_TIMESTAMP),
    (proj8_id, 'SFML', CURRENT_TIMESTAMP),
    (proj8_id, 'Simulation', CURRENT_TIMESTAMP),
    (proj8_id, 'Flocking Behavior', CURRENT_TIMESTAMP),
    (proj8_id, 'Graphics', CURRENT_TIMESTAMP);

    -- Project 9: Time Warp Explorer
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Time Warp Explorer',
        'Figma, UI/UX Design',
        'https://www.figma.com/design/mY3YaseXiULu6iLtEUf7rd/HCI-High-Fidelity-Prototype?node-id=1-2&t=TAmIIZ4EZpqVsINR-1',
        6,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj9_id;

    -- Insert bullets for Project 9
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj9_id, 'Designed a mobile app prototype in Figma to enable historic exploration through interactive timelines, manuscript readers, and personalized trip planners centered around ancient monuments and cultures.', 1, CURRENT_TIMESTAMP),
    (proj9_id, 'Applied user-centered design principles to craft an intuitive interface with navigable sections and visual hierarchy, optimized for educational engagement and mobile accessibility.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 9
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj9_id, 'Figma', CURRENT_TIMESTAMP),
    (proj9_id, 'UI/UX', CURRENT_TIMESTAMP),
    (proj9_id, 'Design', CURRENT_TIMESTAMP),
    (proj9_id, 'Prototyping', CURRENT_TIMESTAMP),
    (proj9_id, 'Mobile App', CURRENT_TIMESTAMP);

    -- Project 10: LLMs in Autonomous Driving
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'LLMs in Autonomous Driving',
        'Transformers, PPO, Prompt Engineering, Scenario Generation',
        'https://drive.google.com/file/d/1RJWveXh4rcnqOPIw0vvrVx2yKVOpdWuZ/view',
        8,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj10_id;

    -- Insert bullets for Project 10
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj10_id, 'Co-authored a review paper surveying 12 cutting-edge approaches integrating Large Language Models (LLMs) into autonomous driving, including DriveGPT4, MTD-GPT, GenAD, and ChatScene, covering domains like planning, perception, QA, and generation.', 1, CURRENT_TIMESTAMP),
    (proj10_id, 'Explored advances in safety-driven superalignment, vision-language reasoning, scenario generation, and multimodal prompt design, highlighting zero-shot learning, real-time planning, and future directions for LLM4AD systems.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 10
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj10_id, 'DriveGPT4', CURRENT_TIMESTAMP),
    (proj10_id, 'MTD-GPT', CURRENT_TIMESTAMP),
    (proj10_id, 'ChatScene', CURRENT_TIMESTAMP),
    (proj10_id, 'GenAD', CURRENT_TIMESTAMP),
    (proj10_id, 'Vision-Language Models', CURRENT_TIMESTAMP),
    (proj10_id, 'Scenario Generation', CURRENT_TIMESTAMP),
    (proj10_id, 'Zero-Shot Learning', CURRENT_TIMESTAMP),
    (proj10_id, 'Prompt Engineering', CURRENT_TIMESTAMP),
    (proj10_id, 'Superalignment', CURRENT_TIMESTAMP),
    (proj10_id, 'Proximal Policy Optimization (PPO)', CURRENT_TIMESTAMP),
    (proj10_id, 'End-to-End Driving', CURRENT_TIMESTAMP),
    (proj10_id, 'Perception', CURRENT_TIMESTAMP),
    (proj10_id, 'Planning', CURRENT_TIMESTAMP),
    (proj10_id, 'Question Answering', CURRENT_TIMESTAMP),
    (proj10_id, 'LLM4AD', CURRENT_TIMESTAMP),
    (proj10_id, 'Transformer Architectures', CURRENT_TIMESTAMP);

    -- Project 11: Resume Updater Tool
    INSERT INTO projects (user_id, title, technologies, link, priority, created_at, updated_at)
    VALUES (
        soham_user_id,
        'Resume Updater Tool',
        'Java, Spring Boot, LaTeX, OpenAI LLMs, Resume Parsing, REST APIs',
        '',
        7,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO proj11_id;

    -- Insert bullets for Project 11
    INSERT INTO project_bullets (project_id, bullet_text, order_index, created_at) VALUES
    (proj11_id, 'Designed a backend tool using Java and Spring Boot to dynamically generate tailored one-page LaTeX resumes by matching job descriptions with pre-curated experience and project bullet banks.', 1, CURRENT_TIMESTAMP),
    (proj11_id, 'Integrated OpenAI LLMs to analyze job postings, extract relevant keywords, and reorder resume sections based on matching context, with output exported into the JX Overleaf resume template.', 2, CURRENT_TIMESTAMP);

    -- Insert technologies for Project 11
    INSERT INTO project_technologies (project_id, technology, created_at) VALUES
    (proj11_id, 'Spring Boot', CURRENT_TIMESTAMP),
    (proj11_id, 'Java', CURRENT_TIMESTAMP),
    (proj11_id, 'REST API', CURRENT_TIMESTAMP),
    (proj11_id, 'LaTeX', CURRENT_TIMESTAMP),
    (proj11_id, 'LLM Integration', CURRENT_TIMESTAMP),
    (proj11_id, 'Resume Parsing', CURRENT_TIMESTAMP),
    (proj11_id, 'Dynamic Resume Generation', CURRENT_TIMESTAMP),
    (proj11_id, 'One-Page Resume', CURRENT_TIMESTAMP),
    (proj11_id, 'OpenAI', CURRENT_TIMESTAMP),
    (proj11_id, 'Template Automation', CURRENT_TIMESTAMP);

    -- Insert Education
    INSERT INTO education (user_id, degree, institution, date_range, gpa, location, created_at, updated_at)
    VALUES 
    (soham_user_id, 'Master of Computer Science', 'North Carolina State University', 'Aug. 2023--May 2025', '4.0/4.0', 'Raleigh, NC', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (soham_user_id, 'Bachelor''s of Engineering in Computer Science and Engineering', 'Maharaja Sayajirao University of Baroda', 'Jun 2017--May 2021', '3.97/4.0', 'Baroda, India', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    -- Insert Skills
    -- Programming Languages
    INSERT INTO skills (user_id, category, skill_name, order_index, created_at) VALUES
    (soham_user_id, 'Languages', 'Java', 1, CURRENT_TIMESTAMP),
    (soham_user_id, 'Languages', 'TypeScript', 2, CURRENT_TIMESTAMP),
    (soham_user_id, 'Languages', 'C++', 3, CURRENT_TIMESTAMP),
    (soham_user_id, 'Languages', 'JavaScript', 4, CURRENT_TIMESTAMP),
    (soham_user_id, 'Languages', 'Python', 5, CURRENT_TIMESTAMP),
    (soham_user_id, 'Languages', 'SQL', 6, CURRENT_TIMESTAMP),
    (soham_user_id, 'Languages', 'HTML5', 7, CURRENT_TIMESTAMP),
    (soham_user_id, 'Languages', 'CSS', 8, CURRENT_TIMESTAMP);

    -- Skills & Technologies
    INSERT INTO skills (user_id, category, skill_name, order_index, created_at) VALUES
    (soham_user_id, 'Skills & Technologies', 'Angular', 1, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'React', 2, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'OpenCV', 3, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Git', 4, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Docker', 5, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'AWS', 6, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'JIRA', 7, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'CI/CD', 8, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Jest', 9, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Lambda', 10, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'SFML', 11, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Cloud Computing', 12, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Agile Development', 13, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Frontend', 14, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Backend', 15, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Full-Stack', 16, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Object Oriented Programming techniques', 17, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'NodeJS', 18, CURRENT_TIMESTAMP),
    (soham_user_id, 'Skills & Technologies', 'Kubernetes', 19, CURRENT_TIMESTAMP);

    -- Tools
    INSERT INTO skills (user_id, category, skill_name, order_index, created_at) VALUES
    (soham_user_id, 'Tools', 'VS Code', 1, CURRENT_TIMESTAMP),
    (soham_user_id, 'Tools', 'Figma', 2, CURRENT_TIMESTAMP),
    (soham_user_id, 'Tools', 'Adobe Photoshop', 3, CURRENT_TIMESTAMP),
    (soham_user_id, 'Tools', 'Jupyter Notebook', 4, CURRENT_TIMESTAMP);

    -- Insert Certifications
    INSERT INTO certifications (user_id, name, issuer, date_obtained, link, created_at, updated_at)
    VALUES
    (soham_user_id, 'AWS Developer - Associate', 'Amazon Web Services', '2023-01-01', 'https://www.credly.com/badges/d4d4f75b-4cb0-4a20-9894-81c708702ac6/public_url', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (soham_user_id, 'Machine Learning', 'Stanford University', '2023-01-01', 'https://coursera.org/share/c9a90f32d51a5129cb43d1bc746e889a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

END $$; 