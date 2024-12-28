/**
 * Component that renders the summary panel of the dashboard page.
 *
 * The panel presents a summary of the user's progress, with the percentage of
 * goal completion.
 *
 * @returns {JSX.Element}
 */
export default function Overview(): JSX.Element {
  // TODO: This component should show progress of the user's goals (maybe 3 mostly completed)
  // TODO: Add user clock with the current events.
  // TODO: More notifications?

  return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Seu Progresso</h2>
        <p className="text-gray-600">Você completou 75% dos seus objetivos!</p>
      </div>
    );
}
