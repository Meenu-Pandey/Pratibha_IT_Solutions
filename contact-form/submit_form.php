<?php
require 'config.php';

// Sanitize input data
function sanitize($data) {
    return htmlspecialchars(stripslashes(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Get form data
$firstName = sanitize($_POST['firstName'] ?? '');
$lastName = sanitize($_POST['lastName'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$phone = sanitize($_POST['phone'] ?? '');
$company = sanitize($_POST['company'] ?? '');
$serviceInterest = sanitize($_POST['serviceInterest'] ?? '');
$projectBudget = sanitize($_POST['projectBudget'] ?? '');
$message = sanitize($_POST['message'] ?? '');
$newsletter = isset($_POST['newsletter']) ? 1 : 0;

// Validation
$errors = [];

if (empty($firstName)) $errors[] = "First name is required";
if (empty($lastName)) $errors[] = "Last name is required";
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
if (empty($message)) $errors[] = "Message is required";

// Return errors if any
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO submissions (
    first_name, last_name, email, phone, company, 
    service_interest, project_budget, message, newsletter
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssssssssi", 
    $firstName, $lastName, $email, $phone, $company, 
    $serviceInterest, $projectBudget, $message, $newsletter
);

// Execute SQL
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been received.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error saving to database.']);
}

$stmt->close();
$conn->close();
?>