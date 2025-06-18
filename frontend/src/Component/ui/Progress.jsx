export function Progress({ value }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
