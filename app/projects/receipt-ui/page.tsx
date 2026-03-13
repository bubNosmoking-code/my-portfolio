export default function ReceiptUIPage() {
  return (
    <iframe
      src="/receipt-ui.html"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
      title="Receipt UI"
    />
  );
}