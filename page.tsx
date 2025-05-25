"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCw, Copy, Check, Play, Code, Book, Zap } from "lucide-react"
import Image from "next/image"

interface RandomImage {
  id: string
  title: string
  image: string
  category: string
  timestamp: string
}

interface ApiResponse {
  success: boolean
  count: number
  offset: number
  total_requested: number
  data: RandomImage | RandomImage[]
  pagination?: {
    current_offset: number
    current_count: number
    next_offset: number
    has_more: boolean
  }
}

export default function RandomImagesAPI() {
  const [images, setImages] = useState<RandomImage[]>([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState("5")
  const [offset, setOffset] = useState("0")
  const [category, setCategory] = useState("all")
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const fetchRandomImages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (count) params.append("count", count)
      if (offset) params.append("offset", offset)
      if (category !== "all") params.append("category", category)

      const response = await fetch(`/api/random-images?${params}`)
      const result: ApiResponse = await response.json()

      if (result.success) {
        setImages(Array.isArray(result.data) ? result.data : [result.data])
        setApiResponse(result)
      }
    } catch (error) {
      console.error("Failed to fetch images:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateCurlCommand = () => {
    const params = new URLSearchParams()
    if (count) params.append("count", count)
    if (offset) params.append("offset", offset)
    if (category !== "all") params.append("category", category)

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.hostname === "localhost"
          ? window.location.origin
          : "https://your-app-name.vercel.app"
        : "https://your-app-name.vercel.app"
    return `curl -X GET "${baseUrl}/api/random-images?${params}"`
  }

  const generateJavaScriptCode = () => {
    const params = new URLSearchParams()
    if (count) params.append("count", count)
    if (offset) params.append("offset", offset)
    if (category !== "all") params.append("category", category)

    return `// Fetch random images
const response = await fetch('/api/random-images?${params}')
const data = await response.json()

if (data.success) {
  console.log(\`Generated \${data.count} images\`)
  console.log(data.data)
} else {
  console.error('API Error:', data.error)
}`
  }

  const generatePythonCode = () => {
    const params = new URLSearchParams()
    if (count) params.append("count", count)
    if (offset) params.append("offset", offset)
    if (category !== "all") params.append("category", category)

    return `import requests

# Fetch random images
response = requests.get('https://your-app-name.vercel.app/api/random-images?${params}')
data = response.json()

if data['success']:
    print(f"Generated {data['count']} images")
    print(data['data'])
else:
    print(f"API Error: {data['error']}")`
  }

  const sampleResponse = {
    success: true,
    count: 3,
    offset: 0,
    total_requested: 3,
    data: [
      {
        id: "img_1704123456789_abc123def_0",
        title: "Serene Mountain Landscape",
        image: "https://source.unsplash.com/800x600/?nature&sig=12345",
        category: "nature",
        timestamp: "2024-01-15T10:30:00.000Z",
      },
      {
        id: "img_1704123456790_def456ghi_1",
        title: "Urban City Skyline",
        image: "https://picsum.photos/800/600?random=67890",
        category: "city",
        timestamp: "2024-01-15T10:30:01.000Z",
      },
      {
        id: "img_1704123456791_ghi789jkl_2",
        title: "Peaceful Ocean Waves",
        image: "https://source.unsplash.com/800x600/?ocean&sig=54321",
        category: "ocean",
        timestamp: "2024-01-15T10:30:02.000Z",
      },
    ],
  }

  const samplePaginatedResponse = {
    success: true,
    count: 100,
    offset: 0,
    total_requested: 100,
    data: "... array of 100 image objects ...",
    pagination: {
      current_offset: 0,
      current_count: 100,
      next_offset: 100,
      has_more: true,
    },
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Random Images API</h1>
        <p className="text-xl text-muted-foreground mb-4">Generate up to 1000 random images with titles and metadata</p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">REST API</Badge>
          <Badge variant="secondary">JSON Response</Badge>
          <Badge variant="secondary">1000+ Images</Badge>
          <Badge variant="secondary">40+ Categories</Badge>
        </div>
      </div>

      <Tabs defaultValue="documentation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="playground" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            API Playground
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Examples
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Response Format
          </TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono">GET /api/random-images</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("/api/random-images", "endpoint")}>
                    {copiedStates.endpoint ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Query Parameters</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-muted px-2 py-1 rounded">count</code>
                      <Badge variant="outline">optional</Badge>
                      <Badge variant="secondary">integer</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Number of images to generate (1-1000). Default: 1</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-muted px-2 py-1 rounded">offset</code>
                      <Badge variant="outline">optional</Badge>
                      <Badge variant="secondary">integer</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Starting position for pagination. Default: 0</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-muted px-2 py-1 rounded">category</code>
                      <Badge variant="outline">optional</Badge>
                      <Badge variant="secondary">string</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Filter images by category. Available categories:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "nature",
                        "city",
                        "landscape",
                        "architecture",
                        "travel",
                        "food",
                        "technology",
                        "animals",
                        "abstract",
                        "people",
                        "ocean",
                        "mountains",
                        "forest",
                        "vintage",
                        "modern",
                      ].map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">
                        +25 more...
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limits & Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1000</div>
                  <div className="text-sm text-muted-foreground">Max images per request</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">∞</div>
                  <div className="text-sm text-muted-foreground">Total requests per day</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">40+</div>
                  <div className="text-sm text-muted-foreground">Available categories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Playground Tab */}
        <TabsContent value="playground" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Playground</CardTitle>
              <p className="text-muted-foreground">Test the API with different parameters</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="count">Count (1-1000)</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="1000"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="offset">Offset</Label>
                  <Input id="offset" type="number" min="0" value={offset} onChange={(e) => setOffset(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                      <SelectItem value="architecture">Architecture</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="animals">Animals</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="people">People</SelectItem>
                      <SelectItem value="ocean">Ocean</SelectItem>
                      <SelectItem value="mountains">Mountains</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>Generated URL:</Label>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateCurlCommand(), "url")}>
                    {copiedStates.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <code className="text-sm break-all">{generateCurlCommand()}</code>
              </div>

              <Button onClick={fetchRandomImages} disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Test API Call
              </Button>

              {apiResponse && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">API Response</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(apiResponse, null, 2), "response")}
                      >
                        {copiedStates.response ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>

                  {images.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Generated Images ({images.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {images.slice(0, 12).map((image) => (
                          <Card key={image.id} className="overflow-hidden">
                            <div className="aspect-video relative">
                              <Image
                                src={image.image || "/placeholder.svg"}
                                alt={image.title}
                                fill
                                className="object-cover"
                                crossOrigin="anonymous"
                              />
                            </div>
                            <CardContent className="p-3">
                              <h4 className="font-medium text-sm line-clamp-2">{image.title}</h4>
                              <p className="text-xs text-muted-foreground">{image.category}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {images.length > 12 && (
                        <p className="text-center text-muted-foreground mt-4">
                          ... and {images.length - 12} more images
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  cURL
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateCurlCommand(), "curl")}>
                    {copiedStates.curl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{generateCurlCommand()}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  JavaScript/TypeScript
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateJavaScriptCode(), "js")}>
                    {copiedStates.js ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{generateJavaScriptCode()}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Python
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatePythonCode(), "python")}>
                    {copiedStates.python ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{generatePythonCode()}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Node.js (with axios)
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `const axios = require('axios');

// Fetch random images
const response = await axios.get('/api/random-images', {
  params: {
    count: ${count},
    offset: ${offset},
    ${category !== "all" ? `category: '${category}'` : '// category: "nature"'}
  }
});

console.log('Generated images:', response.data.count);
console.log(response.data.data);`,
                        "nodejs",
                      )
                    }
                  >
                    {copiedStates.nodejs ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`const axios = require('axios');

// Fetch random images
const response = await axios.get('/api/random-images', {
  params: {
    count: ${count},
    offset: ${offset},
    ${category !== "all" ? `category: '${category}'` : '// category: "nature"'}
  }
});

console.log('Generated images:', response.data.count);
console.log(response.data.data);`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Response Format Tab */}
        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Single Image Response
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          success: true,
                          count: 1,
                          offset: 0,
                          total_requested: 1,
                          data: {
                            id: "img_1704123456789_abc123def_0",
                            title: "Serene Mountain Landscape",
                            image: "https://source.unsplash.com/800x600/?nature&sig=12345",
                            category: "nature",
                            timestamp: "2024-01-15T10:30:00.000Z",
                          },
                        },
                        null,
                        2,
                      ),
                      "single",
                    )
                  }
                >
                  {copiedStates.single ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(
                  {
                    success: true,
                    count: 1,
                    offset: 0,
                    total_requested: 1,
                    data: {
                      id: "img_1704123456789_abc123def_0",
                      title: "Serene Mountain Landscape",
                      image: "https://source.unsplash.com/800x600/?nature&sig=12345",
                      category: "nature",
                      timestamp: "2024-01-15T10:30:00.000Z",
                    },
                  },
                  null,
                  2,
                )}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Multiple Images Response
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(sampleResponse, null, 2), "multiple")}
                >
                  {copiedStates.multiple ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(sampleResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Paginated Response (50+ images)
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(samplePaginatedResponse, null, 2), "paginated")}
                >
                  {copiedStates.paginated ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(samplePaginatedResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <code className="bg-muted px-2 py-1 rounded">success</code>
                  <Badge variant="secondary" className="ml-2">
                    boolean
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Indicates if the request was successful</p>
                </div>

                <div className="border rounded-lg p-4">
                  <code className="bg-muted px-2 py-1 rounded">count</code>
                  <Badge variant="secondary" className="ml-2">
                    integer
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Number of images returned in this response</p>
                </div>

                <div className="border rounded-lg p-4">
                  <code className="bg-muted px-2 py-1 rounded">offset</code>
                  <Badge variant="secondary" className="ml-2">
                    integer
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Starting position used for this request</p>
                </div>

                <div className="border rounded-lg p-4">
                  <code className="bg-muted px-2 py-1 rounded">total_requested</code>
                  <Badge variant="secondary" className="ml-2">
                    integer
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Total number of images requested</p>
                </div>

                <div className="border rounded-lg p-4">
                  <code className="bg-muted px-2 py-1 rounded">data</code>
                  <Badge variant="secondary" className="ml-2">
                    object | array
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Single image object (count=1) or array of image objects (count&gt;1)
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <code className="bg-muted px-2 py-1 rounded">pagination</code>
                  <Badge variant="outline" className="ml-2">
                    optional
                  </Badge>
                  <Badge variant="secondary" className="ml-2">
                    object
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pagination metadata (included when count &gt; 50)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Error Response
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          success: false,
                          error: "Failed to generate random images",
                        },
                        null,
                        2,
                      ),
                      "error",
                    )
                  }
                >
                  {copiedStates.error ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(
                  {
                    success: false,
                    error: "Failed to generate random images",
                  },
                  null,
                  2,
                )}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
