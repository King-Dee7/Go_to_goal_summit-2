import Link from 'next/link';

export default function RSVPSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const status = searchParams.status as string;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          RSVP Confirmed
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Response recorded successfully</h3>
              </div>
            </div>
          </div>
          
          <p className="text-md text-gray-700 mb-6">
            {status === 'in-person' && "We're excited to see you at the Google AI Office in Accra! Your name is on the list."}
            {status === 'virtual' && "We've got you down for virtual attendance. We'll send you the stream link closer to the event!"}
            {status === 'declined' && "We're sorry you can't make it this time. Hope to see you at the next Reinvent Africa event!"}
            {!status && "Thank you for confirming your RSVP!"}
          </p>

          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
