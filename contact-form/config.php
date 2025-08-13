<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'tech_contact');
define('DB_USER', 'root');
define('DB_PASS', 'Prathamesh@12');

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create contact submissions table if not exists
$sql = "CREATE TABLE IF NOT EXISTS submissions (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    service_interest VARCHAR(50),
    project_budget VARCHAR(50),
    message TEXT NOT NULL,
    newsletter BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($sql)) {
    die("Error creating table: " . $conn->error);
}

// Create job applications table if not exists
$sql = "CREATE TABLE IF NOT EXISTS job_applications (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    experience VARCHAR(20) NOT NULL,
    current_company VARCHAR(100),
    linkedin_profile VARCHAR(255),
    portfolio_website VARCHAR(255),
    cover_letter TEXT,
    resume_path VARCHAR(255) NOT NULL,
    agreed_to_terms BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($sql)) {
    die("Error creating table: " . $conn->error);
}

// Function to handle job application submission
function processJobApplication($conn) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['fullName'])) {
        // Validate required fields
        $required = ['fullName', 'email', 'experience', 'resume'];
        foreach ($required as $field) {
            if (empty($_POST[$field]) && $field !== 'resume') {
                return ['success' => false, 'message' => ucfirst($field) . ' is required'];
            }
        }

        // Handle file upload
        $resumePath = '';
        if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
            $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            $maxSize = 5 * 1024 * 1024; // 5MB
            $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($fileInfo, $_FILES['resume']['tmp_name']);
            finfo_close($fileInfo);

            if (!in_array($mimeType, $allowedTypes)) {
                return ['success' => false, 'message' => 'Invalid file type. Only PDF, DOC, and DOCX are allowed.'];
            }

            if ($_FILES['resume']['size'] > $maxSize) {
                return ['success' => false, 'message' => 'File size exceeds 5MB limit.'];
            }

            $uploadDir = 'uploads/resumes/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $extension = pathinfo($_FILES['resume']['name'], PATHINFO_EXTENSION);
            $filename = uniqid('resume_', true) . '.' . $extension;
            $resumePath = $uploadDir . $filename;

            if (!move_uploaded_file($_FILES['resume']['tmp_name'], $resumePath)) {
                return ['success' => false, 'message' => 'Failed to upload resume.'];
            }
        } else {
            return ['success' => false, 'message' => 'Resume is required.'];
        }

        // Prepare data for database
        $fullName = $conn->real_escape_string($_POST['fullName']);
        $email = $conn->real_escape_string($_POST['email']);
        $phone = isset($_POST['phone']) ? $conn->real_escape_string($_POST['phone']) : null;
        $experience = $conn->real_escape_string($_POST['experience']);
        $currentCompany = isset($_POST['currentCompany']) ? $conn->real_escape_string($_POST['currentCompany']) : null;
        $linkedin = isset($_POST['linkedin']) ? $conn->real_escape_string($_POST['linkedin']) : null;
        $portfolio = isset($_POST['portfolio']) ? $conn->real_escape_string($_POST['portfolio']) : null;
        $coverLetter = isset($_POST['coverLetter']) ? $conn->real_escape_string($_POST['coverLetter']) : null;
        $agreed = isset($_POST['agree']) ? 1 : 0;

        // Insert into database
        $sql = "INSERT INTO job_applications (full_name, email, phone, experience, current_company, linkedin_profile, portfolio_website, cover_letter, resume_path, agreed_to_terms) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssssi", $fullName, $email, $phone, $experience, $currentCompany, $linkedin, $portfolio, $coverLetter, $resumePath, $agreed);
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Application submitted successfully!'];
        } else {
            if (file_exists($resumePath)) {
                unlink($resumePath);
            }
            return ['success' => false, 'message' => 'Error submitting application: ' . $stmt->error];
        }
    }
    return null;
}
?>