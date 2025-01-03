export type Tab = {
  id: string;
  label: string;
  icon: JSX.Element;
};

/**
 * Tab navigation component
 * @param {Tab[]} tabs - Array of tabs, each containing an id, label, and icon
 * @param {string} props.selectedTab - The currently selected tab
 * @param {(id: string) => void} props.onSelect - Function to call when a tab is selected
 * @returns {JSX.Element} A rendered tab navigation component
 */
export default function TabNavigation({ tabs, selectedTab, onSelect }: { tabs: Tab[]; selectedTab: string; onSelect: (id: string) => void }): JSX.Element {
  return (
    <div className="flex space-x-6 border-b border-gray-200 pb-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-300 ${
            selectedTab === tab.id
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
