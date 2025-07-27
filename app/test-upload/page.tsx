import ImageUpload from '@/components/upload'

export default function TestUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Image Upload
          </h1>
          <p className="text-gray-600 mb-8">
            Test the Supabase image upload functionality
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <ImageUpload />
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Instructions:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make sure you have created a bucket named "images" in Supabase Storage</li>
              <li>• Set the bucket to public if you want direct URL access</li>
              <li>• Configure storage policies to allow uploads</li>
              <li>• Add your Supabase credentials to .env.local</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
