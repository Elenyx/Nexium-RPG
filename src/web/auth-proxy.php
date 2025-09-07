<?php
/**
 * Discord OAuth Proxy
 * 
 * This script acts as a bridge between Apache and Node.js for the Discord OAuth flow.
 * It forwards requests to the local Node.js server running on port 3000.
 * 
 * Place this file in your web root directory alongside your HTML files.
 */

// Configure error reporting (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Extract the requested path from the URL
$requestPath = $_SERVER['REQUEST_URI'];

// Create the forwarding URL to your Node.js server
$nodeServerUrl = "http://localhost:3000" . $requestPath;

// Function to forward the request and return the response
function forwardRequest($url) {
    $options = array(
        'http' => array(
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'method' => $_SERVER['REQUEST_METHOD'],
            'content' => file_get_contents('php://input'),
            'follow_location' => false  // Don't follow redirects automatically
        )
    );

    // Forward any cookies from the request
    if (isset($_SERVER['HTTP_COOKIE'])) {
        $options['http']['header'] .= "Cookie: " . $_SERVER['HTTP_COOKIE'] . "\r\n";
    }

    // Create the context for the request
    $context = stream_context_create($options);

    // Make the request to the Node.js server
    $result = @file_get_contents($url, false, $context);

    // Get response headers
    $responseHeaders = $http_response_header ?? [];
    
    // Process and forward the response headers
    foreach ($responseHeaders as $header) {
        // Skip the status line and content-length (which will be regenerated)
        if (!preg_match('/^HTTP\/\d\.\d\s+\d+/', $header) && 
            !preg_match('/^Content-Length:/', $header)) {
            header($header);
        }
    }

    // Check if this was a redirect response
    foreach ($responseHeaders as $header) {
        if (preg_match('/^Location: (.*)$/', $header, $matches)) {
            header("Location: " . $matches[1]);
            exit;
        }
    }

    // Return the response body
    return $result;
}

// Forward the request and echo the response
echo forwardRequest($nodeServerUrl);
?>
