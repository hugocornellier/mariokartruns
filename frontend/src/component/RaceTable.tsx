export default function RaceTable() {
    return (
        <div className="container">
        <table className="responsive-table">
          <thead className="responsive-table__head">
            <tr className="responsive-table__row">
              <th className="responsive-table__head__title responsive-table__head__title--name">
                Date
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--status">
                Player
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--types">
                Time
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--update">
                Length
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--country">
                Country
              </th>
            </tr>
          </thead>
      
          <tbody className="responsive-table__body">
            <tr className="responsive-table__row">
              <td
                className="responsive-table__body__text responsive-table__body__text--name"
              >
                Developer Zahid
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--status"
              >
                <span className="status-indicator status-indicator--active"></span>Active
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--types"
              >
                Attendee, F1
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--update"
              >
                Jul 17, 2021, 01:14 PM
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--country"
              >
                Bangladesh
              </td>
            </tr>
            <tr className="responsive-table__row">
              <td
                className="responsive-table__body__text responsive-table__body__text--name"
              >
                John Doe
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--status"
              >
                <span className="status-indicator status-indicator--new"></span>New
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--types"
              >
                Attendee, F5
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--update"
              >
                Apr 24, 2021, 11:36 AM
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--country"
              >
                USA
              </td>
            </tr>
            <tr className="responsive-table__row">
              <td
                className="responsive-table__body__text responsive-table__body__text--name"
              >
                Ryan Guill
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--status"
              >
                <span className="status-indicator status-indicator--inactive"></span
                >Inactive
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--types"
              >
                Attendee, MSR
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--update"
              >
                Aug 30, 2021, 05:54 PM
              </td>
              <td
                className="responsive-table__body__text responsive-table__body__text--country"
              >
                Canada
              </td>
            </tr>
          </tbody>
        </table>
      </div>      
    )
  }
  