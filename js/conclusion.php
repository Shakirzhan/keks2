<?

require_once 'db.php';

$image = $db->query("SELECT * FROM image ORDER BY id DESC");
$image = $image->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($image);