export default function Footer() {
  return (
    <footer className="w-full px-4 py-6 bg-gray-100 text-center text-sm text-gray-600">
      <div className="max-w-6xl mx-auto">
        © {new Date().getFullYear()} My Next App. All rights reserved.
      </div>
    </footer>
  );
}
