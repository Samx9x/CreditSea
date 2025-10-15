export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} CreditSea Credit Report Processor. Built for CreditSea Assignment.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by MERN Stack + TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
