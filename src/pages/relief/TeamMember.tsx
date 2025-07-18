import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"
import { useAdminStore } from "../../store/adminStore"

export function TeamMembers() {
  const reliefTeamMembers = useAdminStore((s) => s.reliefTeamMembers)

  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold text-green-700">Relief Team Members</h2>
      <ul className="space-y-2">
        {reliefTeamMembers.map((m: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined; role: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined }) => (
          <li key={m.id} className="p-3 border rounded shadow bg-white">
            <p><strong>{m.name}</strong> - {m.role}</p>
            <p className="text-sm text-gray-600">{m.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
