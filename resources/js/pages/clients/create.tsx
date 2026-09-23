import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SearchableSelect from '@/components/ui/searchable-select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { index, store } from '@/routes/flat-owners'

interface User {
    id: number
    name: string
    email: string
}

interface Unit {
    id: number
    unit_number: string
}

interface Building {
    id: number
    name: string
    units: Unit[]
}

interface Project {
    id: number
    name: string
    building_id: number | null
}

interface PageProps {
    users: User[]
    buildings: Building[]
    projects: Project[]
}

export default function Create() {
    const { users, buildings, projects } = usePage<PageProps>().props
    const [userId, setUserId] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [email, setEmail] = useState('')
    const [phoneMobile, setPhoneMobile] = useState('')
    const [phoneWhatsapp, setPhoneWhatsapp] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [nidNo, setNidNo] = useState('')
    const [tinNo, setTinNo] = useState('')
    const [passportNo, setPassportNo] = useState('')
    const [drivingLicence, setDrivingLicence] = useState('')
    const [profession, setProfession] = useState('')
    const [professionOther, setProfessionOther] = useState('')
    const [nationality, setNationality] = useState('')
    const [fatherName, setFatherName] = useState('')
    const [motherName, setMotherName] = useState('')
    const [spouseName, setSpouseName] = useState('')
    const [spouseNidNo, setSpouseNidNo] = useState('')
    const [presentAddress, setPresentAddress] = useState('')
    const [permanentAddress, setPermanentAddress] = useState('')
    const [professionalAddress, setProfessionalAddress] = useState('')
    const [nominees, setNominees] = useState<{ name: string; relationship: string; date_of_birth: string; percentage: string }[]>([])
    const [photo, setPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState('')
    const [processing, setProcessing] = useState(false)
    const [buildingId, setBuildingId] = useState('')
    const [unitId, setUnitId] = useState('')
    const [projectId, setProjectId] = useState('')

    const selectedBuilding = buildings.find(b => String(b.id) === buildingId)
    const filteredUnits = selectedBuilding?.units || []
    const selectedProject = projects.find(p => String(p.id) === projectId)
    const filteredBuildings = selectedProject
        ? buildings.filter(b => b.id === selectedProject.building_id)
        : buildings

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        router.post(
            store(),
            {
                user_id: userId || null,
                company_name: companyName,
                contact_person: contactPerson,
                email,
                phone_mobile: phoneMobile,
                phone_whatsapp: phoneWhatsapp,
                date_of_birth: dateOfBirth || null,
                nid_no: nidNo,
                tin_no: tinNo,
                passport_no: passportNo,
                driving_licence: drivingLicence,
                profession: profession === 'Others' && professionOther ? professionOther : profession,
                nationality,
                father_name: fatherName,
                mother_name: motherName,
                spouse_name: spouseName,
                spouse_nid_no: spouseNidNo,
                present_address: presentAddress,
                permanent_address: permanentAddress,
                professional_address: professionalAddress,
                photo: photo || undefined,
                nominees: nominees.map(n => ({ ...n, percentage: n.percentage ? parseInt(n.percentage) : null, date_of_birth: n.date_of_birth || null })),
                building_id: buildingId || null,
                unit_id: unitId || null,
                project_id: projectId || null,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Flat Owner created successfully')
                },
                onFinish: () => setProcessing(false),
            },
        )
    }

    return (
        <>
            <Head title="Create Flat Owner" />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={index()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Flat Owners Detail
                    </Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account & Contact</CardTitle>
                            <CardDescription>User account and primary contact information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border" />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">No Photo</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="photo">Photo</Label>
                                    <Input id="photo" type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setPhoto(file)
                                            setPhotoPreview(URL.createObjectURL(file))
                                        }
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="user_id">User (optional)</Label>
                                <Select value={userId} onValueChange={setUserId}>
                                    <SelectTrigger id="user_id">
                                        <SelectValue placeholder="Select User..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="contact_person">Name of Flat Owners</Label>
                                <Input id="contact_person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="company_name">Company Name</Label>
                                <Input id="company_name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="profession">Profession</Label>
                                    <div className="flex gap-2">
                                        <div className={profession === 'Others' ? 'w-1/2' : 'w-full'}>
                                            <Input
                                                id="profession"
                                                value={profession}
                                                onChange={(e) => setProfession(e.target.value)}
                                                placeholder="Select Profession..."
                                                list="profession-list"
                                            />
                                            <datalist id="profession-list">
                                                <option value="Doctor / Dr." />
                                                <option value="Engineer" />
                                                <option value="Software Engineer" />
                                                <option value="Professor" />
                                                <option value="Lawyer" />
                                                <option value="Advocate" />
                                                <option value="Legal Advisor" />
                                                <option value="Business" />
                                                <option value="Entrepreneur" />
                                                <option value="Journalist" />
                                                <option value="Pilot" />
                                                <option value="Others" />
                                            </datalist>
                                        </div>
                                        {profession === 'Others' && (
                                            <div className="w-1/2">
                                                <Input id="profession_other" value={professionOther} onChange={(e) => setProfessionOther(e.target.value)} placeholder="Please specify" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <div className="relative">
                                        <Input
                                            id="nationality"
                                            value={nationality}
                                            onChange={(e) => setNationality(e.target.value)}
                                            placeholder="Select Nationality..."
                                            list="nationality-list"
                                        />
                                        <datalist id="nationality-list">
                                            <option value="Bangladeshi" />
                                            <option value="Indian" />
                                            <option value="Pakistani" />
                                            <option value="Afghan" />
                                            <option value="Albanian" />
                                            <option value="Algerian" />
                                            <option value="American" />
                                            <option value="Argentine" />
                                            <option value="Australian" />
                                            <option value="Austrian" />
                                            <option value="Bahraini" />
                                            <option value="Belgian" />
                                            <option value="Brazilian" />
                                            <option value="British" />
                                            <option value="Bulgarian" />
                                            <option value="Burmese" />
                                            <option value="Cambodian" />
                                            <option value="Canadian" />
                                            <option value="Chadian" />
                                            <option value="Chilean" />
                                            <option value="Chinese" />
                                            <option value="Colombian" />
                                            <option value="Congolese" />
                                            <option value="Croatian" />
                                            <option value="Cuban" />
                                            <option value="Czech" />
                                            <option value="Danish" />
                                            <option value="Dutch" />
                                            <option value="Egyptian" />
                                            <option value="Emirati" />
                                            <option value="English" />
                                            <option value="Estonian" />
                                            <option value="Ethiopian" />
                                            <option value="Filipino" />
                                            <option value="Finnish" />
                                            <option value="French" />
                                            <option value="German" />
                                            <option value="Ghanaian" />
                                            <option value="Greek" />
                                            <option value="Hong Konger" />
                                            <option value="Hungarian" />
                                            <option value="Icelandic" />
                                            <option value="Indonesian" />
                                            <option value="Iranian" />
                                            <option value="Iraqi" />
                                            <option value="Irish" />
                                            <option value="Israeli" />
                                            <option value="Italian" />
                                            <option value="Jamaican" />
                                            <option value="Japanese" />
                                            <option value="Jordanian" />
                                            <option value="Kazakh" />
                                            <option value="Kenyan" />
                                            <option value="Kuwaiti" />
                                            <option value="Kyrgyz" />
                                            <option value="Lao" />
                                            <option value="Latvian" />
                                            <option value="Lebanese" />
                                            <option value="Libyan" />
                                            <option value="Lithuanian" />
                                            <option value="Malaysian" />
                                            <option value="Maldivian" />
                                            <option value="Mexican" />
                                            <option value="Mongolian" />
                                            <option value="Moroccan" />
                                            <option value="Nepalese" />
                                            <option value="New Zealander" />
                                            <option value="Nigerian" />
                                            <option value="North Korean" />
                                            <option value="Norwegian" />
                                            <option value="Omani" />
                                            <option value="Palestinian" />
                                            <option value="Peruvian" />
                                            <option value="Polish" />
                                            <option value="Portuguese" />
                                            <option value="Qatari" />
                                            <option value="Romanian" />
                                            <option value="Russian" />
                                            <option value="Saudi Arabian" />
                                            <option value="Scottish" />
                                            <option value="Serbian" />
                                            <option value="Singaporean" />
                                            <option value="Slovak" />
                                            <option value="Somali" />
                                            <option value="South African" />
                                            <option value="South Korean" />
                                            <option value="Spanish" />
                                            <option value="Sri Lankan" />
                                            <option value="Sudanese" />
                                            <option value="Swedish" />
                                            <option value="Swiss" />
                                            <option value="Syrian" />
                                            <option value="Taiwanese" />
                                            <option value="Tanzanian" />
                                            <option value="Thai" />
                                            <option value="Tunisian" />
                                            <option value="Turkish" />
                                            <option value="Ugandan" />
                                            <option value="Ukrainian" />
                                            <option value="Uruguayan" />
                                            <option value="Uzbek" />
                                            <option value="Venezuelan" />
                                            <option value="Vietnamese" />
                                            <option value="Welsh" />
                                            <option value="Yemeni" />
                                            <option value="Zimbabwean" />
                                        </datalist>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Your E-mail</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Numbers</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="phone_mobile">Contact No. (Mobile)</Label>
                                <Input id="phone_mobile" value={phoneMobile} onChange={(e) => setPhoneMobile(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="phone_whatsapp">Contact No. (Whatsapp)</Label>
                                <Input id="phone_whatsapp" value={phoneWhatsapp} onChange={(e) => setPhoneWhatsapp(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Identification</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="date_of_birth">Date Of Birth</Label>
                                <Input id="date_of_birth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="nid_no">NID No.</Label>
                                <Input id="nid_no" value={nidNo} onChange={(e) => setNidNo(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tin_no">TIN No.</Label>
                                <Input id="tin_no" value={tinNo} onChange={(e) => setTinNo(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="passport_no">Passport No. (If Any)</Label>
                                <Input id="passport_no" value={passportNo} onChange={(e) => setPassportNo(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="driving_licence">Driving Licence (If Any)</Label>
                                <Input id="driving_licence" value={drivingLicence} onChange={(e) => setDrivingLicence(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Family Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="father_name">Father's Name</Label>
                                <Input id="father_name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="mother_name">Mother's Name</Label>
                                <Input id="mother_name" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="spouse_name">Spouse Name</Label>
                                <Input id="spouse_name" value={spouseName} onChange={(e) => setSpouseName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="spouse_nid_no">Spouse NID No.</Label>
                                <Input id="spouse_nid_no" value={spouseNidNo} onChange={(e) => setSpouseNidNo(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Addresses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="present_address">Present Address</Label>
                                    <textarea
                                        id="present_address"
                                        value={presentAddress}
                                        onChange={(e) => setPresentAddress(e.target.value)}
                                        rows={2}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="permanent_address">Permanent Address</Label>
                                    <textarea
                                        id="permanent_address"
                                        value={permanentAddress}
                                        onChange={(e) => setPermanentAddress(e.target.value)}
                                        rows={2}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="professional_address">Professional Address</Label>
                                <textarea
                                    id="professional_address"
                                    value={professionalAddress}
                                    onChange={(e) => setProfessionalAddress(e.target.value)}
                                    rows={2}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Property Assignment</CardTitle>
                            <CardDescription>Assign a building, unit, and project to this flat owner</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4">
                            <SearchableSelect
                                label="Project"
                                placeholder="Select Project..."
                                options={projects.map(p => ({ value: String(p.id), label: p.name }))}
                                value={projectId}
                                onChange={(v) => { setProjectId(v); setBuildingId(''); setUnitId('') }}
                            />
                            <SearchableSelect
                                label="Building"
                                placeholder={projectId ? 'Select Building...' : 'Select Project First...'}
                                disabled={!projectId}
                                options={filteredBuildings.map(b => ({ value: String(b.id), label: b.name }))}
                                value={buildingId}
                                onChange={(v) => { setBuildingId(v); setUnitId('') }}
                            />
                            <SearchableSelect
                                label="Unit"
                                placeholder={buildingId ? 'Select Unit...' : 'Select Building First...'}
                                disabled={!buildingId}
                                options={filteredUnits.map(u => ({ value: String(u.id), label: u.unit_number }))}
                                value={unitId}
                                onChange={setUnitId}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Nominees</CardTitle>
                            <CardDescription>Add one or more nominees with their details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {nominees.map((nominee, i) => (
                                <div key={i} className="flex items-end gap-2 rounded-lg border p-3">
                                    <div className="grid flex-1 grid-cols-4 gap-2">
                                        <div className="space-y-1">
                                            <Label>Name</Label>
                                            <Input value={nominee.name} onChange={(e) => { const n = [...nominees]; n[i] = { ...n[i], name: e.target.value }; setNominees(n) }} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Relationship</Label>
                                            <Input value={nominee.relationship} onChange={(e) => { const n = [...nominees]; n[i] = { ...n[i], relationship: e.target.value }; setNominees(n) }} placeholder="Select Relationship..." list="relationship-list" />
                                            <datalist id="relationship-list">
                                                <option value="Brother" />
                                                <option value="Daughter" />
                                                <option value="Sister" />
                                                <option value="Son" />
                                                <option value="Wife" />
                                            </datalist>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Date of Birth</Label>
                                            <Input type="date" value={nominee.date_of_birth} onChange={(e) => { const n = [...nominees]; n[i] = { ...n[i], date_of_birth: e.target.value }; setNominees(n) }} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Percentage (%)</Label>
                                            <Input type="number" min={0} max={100} value={nominee.percentage} onChange={(e) => { const n = [...nominees]; n[i] = { ...n[i], percentage: e.target.value }; setNominees(n) }} />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => setNominees(nominees.filter((_, j) => j !== i))}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-destructive"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => setNominees([...nominees, { name: '', relationship: '', date_of_birth: '', percentage: '' }])}>
                                + Add Nominee
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild>
                            <Link href={index()}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Create Flat Owner'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flat Owners Detail', href: '/flat-owners' },
        { title: 'Create', href: '/flat-owners/create' },
    ],
}
