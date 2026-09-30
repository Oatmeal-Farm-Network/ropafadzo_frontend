# ─────────────────────────────────────────────────────────────────────────────
# ANIMAL LOOKUP ENDPOINTS
# Add these to routers/auth.py (append after the existing /animals endpoint)
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from typing import Optional
import json, os, shutil
from datetime import datetime


# ── GET /auth/species/{species_id}/breeds ────────────────────────────────────
@router.get("/species/{species_id}/breeds")
def GetBreeds(species_id: int, Db: Session = Depends(get_db)):
    # Dogs use a hardcoded subset — match legacy ASP logic
    DOG_BREED_IDS = [
        10,12,16,17,28,32,41,51,64,65,66,67,68,72,79,84,87,96,109,114,
        118,120,125,127,128,130,154,161,162,168,170,176,179,188,201,202,
        207,216,217,218,231,239,264,270,273,280,282,289,299,302,318,319,
        331,333,341,353,354,361,369,377,384,386,394,402,406,410,411,427,
        428,442,458,467,893,1023,1487
    ]
    if species_id == 3:
        Breeds = (
            Db.query(models.SpeciesBreedLookup)
            .filter(models.SpeciesBreedLookup.BreedLookupID.in_(DOG_BREED_IDS))
            .order_by(models.SpeciesBreedLookup.Breed)
            .all()
        )
    else:
        Breeds = (
            Db.query(models.SpeciesBreedLookup)
            .filter(models.SpeciesBreedLookup.SpeciesID == species_id)
            .order_by(models.SpeciesBreedLookup.Breed)
            .all()
        )
    return [{"id": B.BreedLookupID, "name": B.Breed.strip()} for B in Breeds]


# ── GET /auth/species/{species_id}/colors ────────────────────────────────────
@router.get("/species/{species_id}/colors")
def GetColors(species_id: int, Db: Session = Depends(get_db)):
    Colors = (
        Db.query(models.SpeciesColorLookup)
        .filter(models.SpeciesColorLookup.SpeciesID == species_id)
        .order_by(models.SpeciesColorLookup.SpeciesColor)
        .all()
    )
    return [C.SpeciesColor for C in Colors]


# ── GET /auth/species/{species_id}/registration-types ────────────────────────
@router.get("/species/{species_id}/registration-types")
def GetRegistrationTypes(species_id: int, Db: Session = Depends(get_db)):
    RegTypes = (
        Db.query(models.SpeciesRegistrationTypeLookup)
        .filter(models.SpeciesRegistrationTypeLookup.SpeciesID == species_id)
        .all()
    )
    return [{"type": R.SpeciesRegistrationType} for R in RegTypes]


# ── GET /auth/species/{species_id}/categories ────────────────────────────────
@router.get("/species/{species_id}/categories")
def GetCategories(species_id: int, Db: Session = Depends(get_db)):
    Categories = (
        Db.query(models.SpeciesCategory)
        .filter(models.SpeciesCategory.SpeciesID == species_id)
        .order_by(models.SpeciesCategory.SpeciesCategoryOrder)
        .all()
    )
    return [
        {
            "id": C.SpeciesCategoryID,
            "singular": C.SpeciesCategory,
            "plural": C.SpeciesCategoryPlural,
        }
        for C in Categories
    ]


# ── POST /auth/animals/add ────────────────────────────────────────────────────
@router.post("/animals/add")
async def AddAnimal(
    # ── Core ──
    BusinessID:      int            = Form(...),
    Name:            str            = Form(...),
    SpeciesID:       int            = Form(...),
    NumberOfAnimals: int            = Form(1),
    Category:        Optional[str]  = Form(None),
    DOB:             Optional[str]  = Form(None),   # "YYYY-MM-DD" or ""

    # ── Breeds ──
    BreedID:         Optional[int]  = Form(None),
    BreedID2:        Optional[int]  = Form(None),
    BreedID3:        Optional[int]  = Form(None),
    BreedID4:        Optional[int]  = Form(None),

    # ── Physical ──
    Color1:          Optional[str]  = Form(None),
    Color2:          Optional[str]  = Form(None),
    Color3:          Optional[str]  = Form(None),
    Color4:          Optional[str]  = Form(None),
    Height:          Optional[str]  = Form(None),
    Weight:          Optional[str]  = Form(None),
    Gaited:          Optional[str]  = Form(None),
    Warmblood:       Optional[str]  = Form(None),
    Horns:           Optional[str]  = Form(None),
    Temperament:     Optional[str]  = Form(None),

    # ── Description ──
    Description:     Optional[str]  = Form(None),

    # ── JSON blobs ──
    Registrations:      Optional[str]  = Form(None),   # JSON array
    Ancestry:           Optional[str]  = Form(None),   # JSON object
    AncestryDescription:Optional[str]  = Form(None),
    FiberSamples:       Optional[str]  = Form(None),   # JSON array
    Awards:             Optional[str]  = Form(None),   # JSON array

    # ── Alpaca percents ──
    PercentPeruvian:     Optional[str] = Form(None),
    PercentChilean:      Optional[str] = Form(None),
    PercentBolivian:     Optional[str] = Form(None),
    PercentUnknownOther: Optional[str] = Form(None),
    PercentAccoyo:       Optional[str] = Form(None),

    # ── Pricing ──
    ForSale:          Optional[str]  = Form("Yes"),
    Free:             Optional[str]  = Form("No"),
    Price:            Optional[str]  = Form(None),
    Price2:           Optional[str]  = Form(None),
    Price3:           Optional[str]  = Form(None),
    Price4:           Optional[str]  = Form(None),
    MinOrder1:        Optional[str]  = Form(None),
    MinOrder2:        Optional[str]  = Form(None),
    MinOrder3:        Optional[str]  = Form(None),
    MinOrder4:        Optional[str]  = Form(None),
    MaxOrder1:        Optional[str]  = Form(None),
    MaxOrder2:        Optional[str]  = Form(None),
    MaxOrder3:        Optional[str]  = Form(None),
    MaxOrder4:        Optional[str]  = Form(None),
    OBO:              Optional[str]  = Form("No"),
    Discount:         Optional[str]  = Form("0"),
    Foundation:       Optional[str]  = Form("No"),
    StudFee:          Optional[str]  = Form(None),
    PayWhatYouCan:    Optional[str]  = Form("No"),
    DonorMale:        Optional[str]  = Form("No"),
    SemenPrice:       Optional[str]  = Form(None),
    DonorFemale:      Optional[str]  = Form("No"),
    EmbryoPrice:      Optional[str]  = Form(None),
    PriceComments:    Optional[str]  = Form(None),
    CoOwnerBusiness1: Optional[str]  = Form(None),
    CoOwnerName1:     Optional[str]  = Form(None),
    CoOwnerLink1:     Optional[str]  = Form(None),
    CoOwnerBusiness2: Optional[str]  = Form(None),
    CoOwnerName2:     Optional[str]  = Form(None),
    CoOwnerLink2:     Optional[str]  = Form(None),
    CoOwnerBusiness3: Optional[str]  = Form(None),
    CoOwnerName3:     Optional[str]  = Form(None),
    CoOwnerLink3:     Optional[str]  = Form(None),
    VideoEmbed:       Optional[str]  = Form(None),

    # ── File uploads ──
    Photo1:  Optional[UploadFile] = File(None),
    Photo2:  Optional[UploadFile] = File(None),
    Photo3:  Optional[UploadFile] = File(None),
    Photo4:  Optional[UploadFile] = File(None),
    Photo5:  Optional[UploadFile] = File(None),
    Photo6:  Optional[UploadFile] = File(None),
    Photo7:  Optional[UploadFile] = File(None),
    Photo8:  Optional[UploadFile] = File(None),
    Photo9:  Optional[UploadFile] = File(None),
    Photo10: Optional[UploadFile] = File(None),
    Photo11: Optional[UploadFile] = File(None),
    Photo12: Optional[UploadFile] = File(None),
    Photo13: Optional[UploadFile] = File(None),
    Photo14: Optional[UploadFile] = File(None),
    Photo15: Optional[UploadFile] = File(None),
    Photo16: Optional[UploadFile] = File(None),
    Caption1:  Optional[str] = Form(None),
    Caption2:  Optional[str] = Form(None),
    Caption3:  Optional[str] = Form(None),
    Caption4:  Optional[str] = Form(None),
    Caption5:  Optional[str] = Form(None),
    Caption6:  Optional[str] = Form(None),
    Caption7:  Optional[str] = Form(None),
    Caption8:  Optional[str] = Form(None),
    Caption9:  Optional[str] = Form(None),
    Caption10: Optional[str] = Form(None),
    Caption11: Optional[str] = Form(None),
    Caption12: Optional[str] = Form(None),
    Caption13: Optional[str] = Form(None),
    Caption14: Optional[str] = Form(None),
    Caption15: Optional[str] = Form(None),
    Caption16: Optional[str] = Form(None),
    AriDoc:       Optional[UploadFile] = File(None),
    HistogramDoc: Optional[UploadFile] = File(None),
    FiberDoc:     Optional[UploadFile] = File(None),

    Db: Session = Depends(get_db),
):
    # ── helpers ──────────────────────────────────────────────────
    def YesNoToBit(val):
        if val is None: return 0
        return 1 if str(val).lower() in ("yes", "1", "true") else 0

    def ToDecimal(val):
        if not val or str(val).strip() in ("", "None"): return None
        try: return float(str(val).replace(",", "").replace("$", ""))
        except: return None

    def ToInt(val):
        if not val or str(val).strip() in ("", "None"): return None
        try: return int(val)
        except: return None

    # ── duplicate check ──────────────────────────────────────────
    Existing = (
        Db.query(models.Animal)
        .filter(
            models.Animal.BusinessID == BusinessID,
            models.Animal.FullName == Name.strip(),
            models.Animal.SpeciesID == SpeciesID,
        )
        .first()
    )
    if Existing:
        raise HTTPException(
            status_code=400,
            detail=f"You already have a listing titled '{Name}' for this species."
        )

    # ── parse DOB ────────────────────────────────────────────────
    DOBDay, DOBMonth, DOBYear = None, None, None
    if DOB and DOB.strip():
        try:
            ParsedDOB = datetime.strptime(DOB.strip(), "%Y-%m-%d")
            DOBDay   = ParsedDOB.day
            DOBMonth = ParsedDOB.month
            DOBYear  = ParsedDOB.year
        except ValueError:
            pass

    # ── 1. Insert Animals row ────────────────────────────────────
    NewAnimal = models.Animal(
        BusinessID      = BusinessID,
        SpeciesID       = SpeciesID,
        FullName        = Name.strip(),
        NumberOfAnimals = NumberOfAnimals,
        Category        = ToInt(Category),
        Temperment      = ToInt(Temperment),
        BreedID         = ToInt(BreedID),
        BreedID2        = ToInt(BreedID2),
        BreedID3        = ToInt(BreedID3),
        BreedID4        = ToInt(BreedID4),
        DOBday          = DOBDay,
        DOBMonth        = DOBMonth,
        DOBYear         = DOBYear,
        Height          = ToDecimal(Height),
        Weight          = ToDecimal(Weight),
        Gaited          = YesNoToBit(Gaited),
        Warmblooded     = YesNoToBit(Warmblood),
        Horns           = Horns or None,
        Temperament     = ToInt(Temperament),
        Description     = Description or None,
        PublishForSale  = 0,
        Lastupdated     = datetime.utcnow(),
    )
    Db.add(NewAnimal)
    Db.flush()   # gets us the new AnimalID without committing yet
    AID = NewAnimal.AnimalID

    # ── 2. Colors ────────────────────────────────────────────────
    if any([Color1, Color2, Color3, Color4]):
        Db.add(models.AnimalColor(
            AnimalID = AID,
            Color1   = Color1 or None,
            Color2   = Color2 or None,
            Color3   = Color3 or None,
            Color4   = Color4 or None,
        ))

    # ── 3. Registrations ─────────────────────────────────────────
    if Registrations:
        try:
            RegList = json.loads(Registrations)
            for Reg in RegList:
                if Reg.get("number", "").strip():
                    Db.add(models.AnimalRegistration(
                        AnimalID  = AID,
                        RegType   = Reg.get("type", ""),
                        RegNumber = Reg.get("number", "").strip(),
                    ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 4. Ancestry ──────────────────────────────────────────────
    if Ancestry:
        try:
            AncestryData = json.loads(Ancestry)

            def AncVal(key, field):
                return (AncestryData.get(key) or {}).get(field) or None

            Db.add(models.Ancestor(
                AnimalID            = AID,
                SireName            = AncVal("sire", "name"),
                SireColor           = AncVal("sire", "color"),
                SireARI             = AncVal("sire", "ari"),
                SireCLAA            = AncVal("sire", "claa"),
                DamName             = AncVal("dam", "name"),
                DamColor            = AncVal("dam", "color"),
                DamARI              = AncVal("dam", "ari"),
                DamCLAA             = AncVal("dam", "claa"),
                SireSireName        = AncVal("sireSire", "name"),
                SireSireColor       = AncVal("sireSire", "color"),
                SireDamName         = AncVal("sireDam", "name"),
                SireDamColor        = AncVal("sireDam", "color"),
                DamSireName         = AncVal("damSire", "name"),
                DamSireColor        = AncVal("damSire", "color"),
                DamDamName          = AncVal("damDam", "name"),
                DamDamColor         = AncVal("damDam", "color"),
                SireSireSireName    = AncVal("sireSireSire", "name"),
                SireSireSireColor   = AncVal("sireSireSire", "color"),
                SireSireDamName     = AncVal("sireSireDam", "name"),
                SireSireDamColor    = AncVal("sireSireDam", "color"),
                SireDamSireName     = AncVal("sireDamSire", "name"),
                SireDamSireColor    = AncVal("sireDamSire", "color"),
                SireDamDamName      = AncVal("sireDamDam", "name"),
                SireDamDamColor     = AncVal("sireDamDam", "color"),
                DamSireSireName     = AncVal("damSireSire", "name"),
                DamSireSireColor    = AncVal("damSireSire", "color"),
                DamSireDamName      = AncVal("damSireDam", "name"),
                DamSireDamColor     = AncVal("damSireDam", "color"),
                DamDamSireName      = AncVal("damDamSire", "name"),
                DamDamSireColor     = AncVal("damDamSire", "color"),
                DamDamDamName       = AncVal("damDamDam", "name"),
                DamDamDamColor      = AncVal("damDamDam", "color"),
                AncestryDescription = AncestryDescription or None,
            ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 5. Alpaca ancestry percents ──────────────────────────────
    if SpeciesID == 2 and any([
        PercentPeruvian, PercentChilean, PercentBolivian,
        PercentUnknownOther, PercentAccoyo
    ]):
        Db.add(models.AncestryPercent(
            AnimalID            = AID,
            PercentPeruvian     = PercentPeruvian or None,
            PercentChilean      = PercentChilean or None,
            PercentBolivian     = PercentBolivian or None,
            PercentUnknownOther = PercentUnknownOther or None,
            PercentAccoyo       = PercentAccoyo or None,
        ))

    # ── 6. Fiber samples (Alpacas) ───────────────────────────────
    if FiberSamples and SpeciesID == 2:
        try:
            SampleList = json.loads(FiberSamples)
            for Sample in SampleList:
                if not any(Sample.values()):
                    continue
                SampleDay, SampleMonth, SampleYear = None, None, None
                if Sample.get("sampleDate"):
                    try:
                        SD = datetime.strptime(Sample["sampleDate"], "%Y-%m-%d")
                        SampleDay, SampleMonth, SampleYear = SD.day, SD.month, SD.year
                    except ValueError:
                        pass
                Db.add(models.Fiber(
                    AnimalID        = AID,
                    SampleDateDay   = SampleDay,
                    SampleDateMonth = SampleMonth,
                    SampleDateYear  = SampleYear,
                    AFD             = ToDecimal(Sample.get("afd")),
                    SD              = ToDecimal(Sample.get("sd")),
                    COV             = ToDecimal(Sample.get("cov")),
                    CF              = ToDecimal(Sample.get("cf")),
                    GreaterThan30   = ToDecimal(Sample.get("gt30")),
                    Curve           = ToDecimal(Sample.get("curve")),
                    CrimpPerInch    = ToDecimal(Sample.get("crimpsPerInch")),
                    Length          = ToDecimal(Sample.get("stapleLength")),
                    ShearWeight     = ToDecimal(Sample.get("shearWeight")),
                    BlanketWeight   = ToDecimal(Sample.get("blanketWeight")),
                ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 7. Awards ────────────────────────────────────────────────
    if Awards:
        try:
            AwardList = json.loads(Awards)
            for AwardItem in AwardList:
                if not AwardItem.get("year") and not AwardItem.get("show"):
                    continue
                Db.add(models.Award(
                    AnimalID      = AID,
                    AwardYear     = ToInt(AwardItem.get("year")),
                    ShowName      = AwardItem.get("show") or None,
                    Type          = AwardItem.get("class") or None,
                    Placing       = AwardItem.get("placing") or None,
                    Awardcomments = AwardItem.get("description") or None,
                ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 8. Pricing ───────────────────────────────────────────────
    Db.add(models.Pricing(
        AnimalID          = AID,
        Price             = ToDecimal(Price),
        Price2            = ToDecimal(Price2),
        Price3            = ToDecimal(Price3),
        Price4            = ToDecimal(Price4),
        MinOrder1         = ToInt(MinOrder1),
        MinOrder2         = ToInt(MinOrder2),
        MinOrder3         = ToInt(MinOrder3),
        MinOrder4         = ToInt(MinOrder4),
        MaxOrder1         = ToInt(MaxOrder1),
        MaxOrder2         = ToInt(MaxOrder2),
        MaxOrder3         = ToInt(MaxOrder3),
        MaxOrder4         = ToInt(MaxOrder4),
        StudFee           = ToDecimal(StudFee),
        ForSale           = YesNoToBit(ForSale),
        Free              = YesNoToBit(Free),
        OBO               = YesNoToBit(OBO),
        Foundation        = YesNoToBit(Foundation),
        Discount          = ToInt(Discount) or 0,
        PriceComments     = PriceComments or None,
        Donor             = YesNoToBit(DonorMale) or YesNoToBit(DonorFemale),
        EmbryoPrice       = ToDecimal(EmbryoPrice),
        SemenPrice        = ToDecimal(SemenPrice),
        PayWhatYouCanStud = YesNoToBit(PayWhatYouCan),
        Sold              = 0,
        CoOwnerBusiness1  = CoOwnerBusiness1 or None,
        CoOwnerName1      = CoOwnerName1 or None,
        CoOwnerLink1      = CoOwnerLink1 or None,
        CoOwnerBusiness2  = CoOwnerBusiness2 or None,
        CoOwnerName2      = CoOwnerName2 or None,
        CoOwnerLink2      = CoOwnerLink2 or None,
        CoOwnerBusiness3  = CoOwnerBusiness3 or None,
        CoOwnerName3      = CoOwnerName3 or None,
        CoOwnerLink3      = CoOwnerLink3 or None,
    ))

    # ── 9. Photos & documents ────────────────────────────────────
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    async def SaveFile(UploadedFile, Prefix):
        if not UploadedFile or not UploadedFile.filename:
            return None
        Ext      = os.path.splitext(UploadedFile.filename)[1].lower()
        FileName = f"{Prefix}_{AID}{Ext}"
        FilePath = os.path.join(UPLOAD_DIR, FileName)
        with open(FilePath, "wb") as F:
            shutil.copyfileobj(UploadedFile.file, F)
        return FileName

    PhotoFiles = [
        Photo1, Photo2, Photo3, Photo4, Photo5, Photo6, Photo7, Photo8,
        Photo9, Photo10, Photo11, Photo12, Photo13, Photo14, Photo15, Photo16
    ]
    Captions = [
        Caption1, Caption2, Caption3, Caption4, Caption5, Caption6,
        Caption7, Caption8, Caption9, Caption10, Caption11, Caption12,
        Caption13, Caption14, Caption15, Caption16
    ]

    PhotoRow = models.Photo(AnimalID=AID)
    for I, (PFile, Cap) in enumerate(zip(PhotoFiles, Captions), start=1):
        SavedName = await SaveFile(PFile, f"photo{I}")
        if SavedName:
            setattr(PhotoRow, f"Photo{I}", SavedName)
        if Cap:
            setattr(PhotoRow, f"PhotoCaption{I}", Cap)

    PhotoRow.ARI       = await SaveFile(AriDoc, "ari")
    PhotoRow.Histogram = await SaveFile(HistogramDoc, "histogram")
    PhotoRow.FiberAnalysis = await SaveFile(FiberDoc, "fiber")
    PhotoRow.AnimalVideo   = VideoEmbed or None

    Db.add(PhotoRow)

    # ── 10. Commit everything ────────────────────────────────────
    Db.commit()

    return {"animalID": AID, "status": "success"}
