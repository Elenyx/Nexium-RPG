<?php
// Simple Debug Page - Shows basic request info to help diagnose issues
header('Content-Type: text/html');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexium API Debug</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f7f7f7;
            color: #333;
        }
        h1, h2 {
            color: #8A2BE2;
        }
        pre {
            background: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .card {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nexium API Debug Info</h1>
        <p>This page displays information about your server environment to help diagnose API issues.</p>
        
        <div class="card">
            <h2>Server Information</h2>
            <pre><?php echo "PHP Version: " . phpversion(); ?></pre>
            <pre><?php echo "Server Software: " . $_SERVER['SERVER_SOFTWARE']; ?></pre>
        </div>
        
        <div class="card">
            <h2>Request Information</h2>
            <pre><?php echo "Request Method: " . $_SERVER['REQUEST_METHOD']; ?></pre>
            <pre><?php echo "Request URI: " . $_SERVER['REQUEST_URI']; ?></pre>
            <pre><?php echo "HTTP Host: " . $_SERVER['HTTP_HOST']; ?></pre>
        </div>
        
        <div class="card">
            <h2>PHP Configuration</h2>
            <pre><?php
                echo "allow_url_fopen: " . (ini_get('allow_url_fopen') ? "Enabled" : "Disabled") . "\n";
                echo "File Uploads: " . (ini_get('file_uploads') ? "Enabled" : "Disabled") . "\n";
                echo "Max Execution Time: " . ini_get('max_execution_time') . " seconds\n";
                echo "Memory Limit: " . ini_get('memory_limit') . "\n";
                echo "Post Max Size: " . ini_get('post_max_size') . "\n";
            ?></pre>
        </div>

        <div class="card">
            <h2>API Connection Test</h2>
            <pre><?php
                echo "Testing connection to Node.js server...\n\n";
                $nodeUrl = "http://127.0.0.1:3000/";
                
                // Create a stream context with a short timeout
                $context = stream_context_create([
                    'http' => [
                        'timeout' => 5,
                        'ignore_errors' => true
                    ]
                ]);
                
                // Try to connect to the Node.js server
                $result = @file_get_contents($nodeUrl, false, $context);
                
                if ($result !== false) {
                    echo "✅ SUCCESS: Connected to Node.js server!\n";
                    echo "Response length: " . strlen($result) . " bytes";
                } else {
                    echo "❌ ERROR: Could not connect to Node.js server at $nodeUrl\n\n";
                    echo "This likely means the Node.js server is not running or is not accessible.\n";
                    echo "Please make sure your Node.js server is running on port 3000.";
                }
            ?></pre>
        </div>
        
        <div class="card">
            <h2>.htaccess Test</h2>
            <pre><?php
                $htaccessPath = '.htaccess';
                if (file_exists($htaccessPath)) {
                    echo "✅ .htaccess file exists\n";
                    echo "File size: " . filesize($htaccessPath) . " bytes\n";
                    echo "Last modified: " . date("Y-m-d H:i:s", filemtime($htaccessPath)) . "\n\n";
                    
                    // Try to read the first few lines to see if it looks correct
                    $content = @file_get_contents($htaccessPath);
                    if ($content !== false) {
                        $lines = explode("\n", $content);
                        $firstFewLines = array_slice($lines, 0, 5);
                        echo "First 5 lines of .htaccess:\n" . implode("\n", $firstFewLines);
                    } else {
                        echo "Cannot read .htaccess content (permissions issue)";
                    }
                } else {
                    echo "❌ .htaccess file not found in the expected location";
                }
            ?></pre>
        </div>
    </div>
</body>
</html>
