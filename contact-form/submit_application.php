<?php
require_once 'config.php';

// Process the application
$response = processJobApplication($conn);

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>