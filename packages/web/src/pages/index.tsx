import { getAveragePrices } from "@/services/averagePrice";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

type HomeProps = {
  averagePrices: Awaited<ReturnType<typeof getAveragePrices>>;
};

export default function Home({
  averagePrices: initialAveragePrices,
}: HomeProps) {
  const [averagePrices, setAveragePrices] = useState(initialAveragePrices);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetch("/api/averagePrices").then((res) =>
        res.json()
      );

      setAveragePrices(result.data);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="mx-auto mt-6 max-w-4xl p-12">
      <p className="mb-6 text-4xl font-bold">Aktuelle Durchschnittspreise</p>

      <div className="rounded-xl bg-white shadow">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Bezirk
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Preis
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Aktualisiert
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.entries(averagePrices).map(([district, value]) => (
              <tr key={district}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-500">
                  {district}. Bezirk
                </td>

                {value ? (
                  <>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                      {new Intl.NumberFormat("de", {
                        style: "currency",
                        currency: "EUR",
                      }).format(value.price)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                      {new Date(value.timestamp).toLocaleTimeString("de")}
                    </td>
                  </>
                ) : (
                  <td
                    className="whitespace-nowrap px-4 py-2 text-gray-500"
                    colSpan={2}
                  >
                    <span className="italic">Keine Daten</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      averagePrices: await getAveragePrices(),
    },
  };
};
