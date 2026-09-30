from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import create_access_token, get_current_user
import models
import json
import os
import shutil
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])


# ─────────────────────────────────────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    Email: str
    Password: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(models.People).filter(
            models.People.PeopleEmail == request.Email,
            models.People.PeopleActive == 1
        ).first()
        if not user or user.PeoplePassword != request.Password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        token = create_access_token(data={"sub": user.PeopleID})
        return {
            "AccessToken": token,
            "token_type": "bearer",
            "PeopleID": user.PeopleID,
            "PeopleFirstName": user.PeopleFirstName,
            "PeopleLastName": user.PeopleLastName,
            "AccessLevel": user.accesslevel or 0
        }
    except HTTPException:
        raise
    except Exception:
        import traceback
        traceback.print_exc()
        raise


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "PeopleID": current_user.PeopleID,
        "PeopleFirstName": current_user.PeopleFirstName,
        "PeopleLastName": current_user.PeopleLastName,
        "PeopleEmail": current_user.PeopleEmail,
        "AccessLevel": current_user.accesslevel
    }


# ─────────────────────────────────────────────────────────────────────────────
# BUSINESSES
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/my-businesses")
def GetMyBusinesses(PeopleID: int, Db: Session = Depends(get_db)):
    Businesses = (
        Db.query(models.Business)
        .join(models.BusinessAccess, models.Business.BusinessID == models.BusinessAccess.BusinessID)
        .filter(
            models.BusinessAccess.PeopleID == PeopleID,
            models.BusinessAccess.Active == 1
        )
        .all()
    )
    return [{"BusinessID": B.BusinessID, "BusinessName": B.BusinessName} for B in Businesses]


@router.get("/account-home")
def GetAccountHome(BusinessID: int, Db: Session = Depends(get_db)):
    Result = (
        Db.query(models.Business, models.BusinessTypeLookup, models.Address)
        .join(models.BusinessTypeLookup, models.Business.BusinessTypeID == models.BusinessTypeLookup.BusinessTypeID)
        .join(models.Address, models.Business.AddressID == models.Address.AddressID)
        .filter(models.Business.BusinessID == BusinessID)
        .first()
    )
    if not Result:
        raise HTTPException(status_code=404, detail="Business not found")
    B, BT, A = Result
    return {
        "BusinessID": B.BusinessID,
        "BusinessName": B.BusinessName,
        "BusinessEmail": B.BusinessEmail,
        "BusinessTypeID": BT.BusinessTypeID,
        "BusinessType": BT.BusinessType,
        "SubscriptionLevel": B.SubscriptionLevel,
        "SubscriptionEndDate": str(B.SubscriptionEndDate) if hasattr(B, 'SubscriptionEndDate') else None,
        "AddressCity": A.AddressCity,
        "AddressState": A.AddressState,
        "AddressStreet": A.AddressStreet,
        "AddressZip": A.AddressZip,
    }


@router.get("/business-types")
def GetBusinessTypes(Db: Session = Depends(get_db)):
    Types = Db.query(models.BusinessTypeLookup).order_by(models.BusinessTypeLookup.BusinessType).all()
    return [{"BusinessTypeID": T.BusinessTypeID, "BusinessType": T.BusinessType} for T in Types]


@router.put("/change-business-type")
def ChangeBusinessType(BusinessID: int, BusinessTypeID: int, Db: Session = Depends(get_db)):
    B = Db.query(models.Business).filter(models.Business.BusinessID == BusinessID).first()
    if not B:
        raise HTTPException(status_code=404, detail="Business not found")
    B.BusinessTypeID = BusinessTypeID
    Db.commit()
    return {"status": "success"}


# ─────────────────────────────────────────────────────────────────────────────
# ANIMALS — LIST
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/animals")
def GetAnimals(BusinessID: int, Db: Session = Depends(get_db)):
    Results = (
        Db.query(models.Animal, models.SpeciesAvailable, models.Pricing)
        .join(models.SpeciesAvailable, models.Animal.SpeciesID == models.SpeciesAvailable.SpeciesID)
        .outerjoin(models.Pricing, models.Animal.AnimalID == models.Pricing.AnimalID)
        .filter(models.Animal.BusinessID == BusinessID)
        .order_by(models.SpeciesAvailable.SpeciesPriority, models.Animal.FullName)
        .all()
    )

    SpeciesMap = {
        2:"Alpaca",3:"Dog",4:"Llama",5:"Horse",6:"Goat",7:"Donkey",8:"Cattle",
        9:"Bison",10:"Sheep",11:"Rabbit",12:"Pig",13:"Chicken",14:"Turkey",
        15:"Duck",17:"Yak",18:"Camels",19:"Emus",21:"Deer",22:"Geese",23:"Bees",
        25:"Alligators",26:"Guinea Fowl",27:"Musk Ox",28:"Ostriches",
        29:"Pheasants",30:"Pigeons",31:"Quails",33:"Snails",34:"Buffalo"
    }

    Animals = []
    for A, S, P in Results:
        Animals.append({
            "AnimalID":      A.AnimalID,
            "FullName":      A.FullName,
            "SpeciesID":     A.SpeciesID,
            "SpeciesName":   SpeciesMap.get(A.SpeciesID, "Unknown"),
            "Price":         float(P.Price)     if P and P.Price     else 0,
            "StudFee":       float(P.StudFee)   if P and P.StudFee   else 0,
            "SalePrice":     float(P.SalePrice) if P and P.SalePrice else 0,
            "PublishForSale":A.PublishForSale,
        })
    return Animals


# ─────────────────────────────────────────────────────────────────────────────
# SPECIES LOOKUPS
# ─────────────────────────────────────────────────────────────────────────────

DOG_BREED_IDS = [
    10,12,16,17,28,32,41,51,64,65,66,67,68,72,79,84,87,96,109,114,
    118,120,125,127,128,130,154,161,162,168,170,176,179,188,201,202,
    207,216,217,218,231,239,264,270,273,280,282,289,299,302,318,319,
    331,333,341,353,354,361,369,377,384,386,394,402,406,410,411,427,
    428,442,458,467,893,1023,1487
]

@router.get("/species/{species_id}/breeds")
def GetBreeds(species_id: int, Db: Session = Depends(get_db)):
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


@router.get("/species/{species_id}/colors")
def GetColors(species_id: int, Db: Session = Depends(get_db)):
    Colors = (
        Db.query(models.SpeciesColorLookup)
        .filter(models.SpeciesColorLookup.SpeciesID == species_id)
        .order_by(models.SpeciesColorLookup.SpeciesColor)
        .all()
    )
    return [C.SpeciesColor for C in Colors]


@router.get("/species/{species_id}/registration-types")
def GetRegistrationTypes(species_id: int, Db: Session = Depends(get_db)):
    RegTypes = (
        Db.query(models.SpeciesRegistrationTypeLookup)
        .filter(models.SpeciesRegistrationTypeLookup.SpeciesID == species_id)
        .all()
    )
    return [{"type": R.SpeciesRegistrationType} for R in RegTypes]


@router.get("/species/{species_id}/categories")
def GetCategories(species_id: int, Db: Session = Depends(get_db)):
    Cats = (
        Db.query(models.SpeciesCategory)
        .filter(models.SpeciesCategory.SpeciesID == species_id)
        .order_by(models.SpeciesCategory.SpeciesCategoryOrder)
        .all()
    )
    return [{"id": C.SpeciesCategoryID, "singular": C.SpeciesCategory, "plural": C.SpeciesCategoryPlural} for C in Cats]


# ─────────────────────────────────────────────────────────────────────────────
# ANIMALS — ADD
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/animals/add")
async def AddAnimal(
    # Core
    BusinessID:      int           = Form(...),
    Name:            str           = Form(...),
    SpeciesID:       int           = Form(...),
    NumberOfAnimals: int           = Form(1),
    Category:        Optional[str] = Form(None),
    DOB:             Optional[str] = Form(None),
    # Breeds
    BreedID:         Optional[int] = Form(None),
    BreedID2:        Optional[int] = Form(None),
    BreedID3:        Optional[int] = Form(None),
    BreedID4:        Optional[int] = Form(None),
    # Physical
    Color1:          Optional[str] = Form(None),
    Color2:          Optional[str] = Form(None),
    Color3:          Optional[str] = Form(None),
    Color4:          Optional[str] = Form(None),
    Height:          Optional[str] = Form(None),
    Weight:          Optional[str] = Form(None),
    Gaited:          Optional[str] = Form(None),
    Warmblood:       Optional[str] = Form(None),
    Horns:           Optional[str] = Form(None),
    Temperament:     Optional[str] = Form(None),
    Description:     Optional[str] = Form(None),
    # JSON blobs
    Registrations:       Optional[str] = Form(None),
    Ancestry:            Optional[str] = Form(None),
    AncestryDescription: Optional[str] = Form(None),
    FiberSamples:        Optional[str] = Form(None),
    Awards:              Optional[str] = Form(None),
    # Alpaca percents
    PercentPeruvian:     Optional[str] = Form(None),
    PercentChilean:      Optional[str] = Form(None),
    PercentBolivian:     Optional[str] = Form(None),
    PercentUnknownOther: Optional[str] = Form(None),
    PercentAccoyo:       Optional[str] = Form(None),
    # Pricing
    ForSale:          Optional[str] = Form("Yes"),
    Free:             Optional[str] = Form("No"),
    Price:            Optional[str] = Form(None),
    Price2:           Optional[str] = Form(None),
    Price3:           Optional[str] = Form(None),
    Price4:           Optional[str] = Form(None),
    MinOrder1:        Optional[str] = Form(None),
    MinOrder2:        Optional[str] = Form(None),
    MinOrder3:        Optional[str] = Form(None),
    MinOrder4:        Optional[str] = Form(None),
    MaxOrder1:        Optional[str] = Form(None),
    MaxOrder2:        Optional[str] = Form(None),
    MaxOrder3:        Optional[str] = Form(None),
    MaxOrder4:        Optional[str] = Form(None),
    OBO:              Optional[str] = Form("No"),
    Discount:         Optional[str] = Form("0"),
    Foundation:       Optional[str] = Form("No"),
    StudFee:          Optional[str] = Form(None),
    PayWhatYouCan:    Optional[str] = Form("No"),
    DonorMale:        Optional[str] = Form("No"),
    SemenPrice:       Optional[str] = Form(None),
    DonorFemale:      Optional[str] = Form("No"),
    EmbryoPrice:      Optional[str] = Form(None),
    PriceComments:    Optional[str] = Form(None),
    CoOwnerBusiness1: Optional[str] = Form(None),
    CoOwnerName1:     Optional[str] = Form(None),
    CoOwnerLink1:     Optional[str] = Form(None),
    CoOwnerBusiness2: Optional[str] = Form(None),
    CoOwnerName2:     Optional[str] = Form(None),
    CoOwnerLink2:     Optional[str] = Form(None),
    CoOwnerBusiness3: Optional[str] = Form(None),
    CoOwnerName3:     Optional[str] = Form(None),
    CoOwnerLink3:     Optional[str] = Form(None),
    VideoEmbed:       Optional[str] = Form(None),
    # Photos
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
    # ── Helpers ───────────────────────────────────────────────────────────────
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

    # ── Duplicate check ───────────────────────────────────────────────────────
    Existing = (
        Db.query(models.Animal)
        .filter(
            models.Animal.BusinessID == BusinessID,
            models.Animal.FullName   == Name.strip(),
            models.Animal.SpeciesID  == SpeciesID,
        )
        .first()
    )
    if Existing:
        raise HTTPException(status_code=400, detail=f"You already have a listing titled '{Name}' for this species.")

    # ── Parse DOB ─────────────────────────────────────────────────────────────
    DOBDay, DOBMonth, DOBYear = None, None, None
    if DOB and DOB.strip():
        try:
            ParsedDOB = datetime.strptime(DOB.strip(), "%Y-%m-%d")
            DOBDay, DOBMonth, DOBYear = ParsedDOB.day, ParsedDOB.month, ParsedDOB.year
        except ValueError:
            pass

    # ── 1. Animals row ────────────────────────────────────────────────────────
    NewAnimal = models.Animal(
        BusinessID      = BusinessID,
        SpeciesID       = SpeciesID,
        FullName        = Name.strip(),
        NumberOfAnimals = NumberOfAnimals,
        Category      = ToInt(Category),
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
        Temperment     = ToInt(Temperment),
        Description     = Description or None,
        PublishForSale  = 0,
        Lastupdated     = datetime.utcnow(),
    )
    Db.add(NewAnimal)
    Db.flush()
    AID = NewAnimal.AnimalID

    # ── 2. Colors ─────────────────────────────────────────────────────────────
    if any([Color1, Color2, Color3, Color4]):
        Db.add(models.AnimalColor(
            AnimalID=AID, Color1=Color1 or None, Color2=Color2 or None,
            Color3=Color3 or None, Color4=Color4 or None,
        ))

    # ── 3. Registrations ──────────────────────────────────────────────────────
    if Registrations:
        try:
            for Reg in json.loads(Registrations):
                if Reg.get("number", "").strip():
                    Db.add(models.AnimalRegistration(
                        AnimalID=AID, RegType=Reg.get("type",""), RegNumber=Reg.get("number","").strip()
                    ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 4. Ancestry ───────────────────────────────────────────────────────────
    if Ancestry:
        try:
            AD = json.loads(Ancestry)
            def AV(k, f): return (AD.get(k) or {}).get(f) or None
            Db.add(models.Ancestor(
                AnimalID=AID,
                SireName=AV("sire","name"),           SireColor=AV("sire","color"),
                SireARI=AV("sire","ari"),             SireCLAA=AV("sire","claa"),
                DamName=AV("dam","name"),             DamColor=AV("dam","color"),
                DamARI=AV("dam","ari"),               DamCLAA=AV("dam","claa"),
                SireSireName=AV("sireSire","name"),   SireSireColor=AV("sireSire","color"),
                SireDamName=AV("sireDam","name"),     SireDamColor=AV("sireDam","color"),
                DamSireName=AV("damSire","name"),     DamSireColor=AV("damSire","color"),
                DamDamName=AV("damDam","name"),       DamDamColor=AV("damDam","color"),
                SireSireSireName=AV("sireSireSire","name"),  SireSireSireColor=AV("sireSireSire","color"),
                SireSireDamName=AV("sireSireDam","name"),    SireSireDamColor=AV("sireSireDam","color"),
                SireDamSireName=AV("sireDamSire","name"),    SireDamSireColor=AV("sireDamSire","color"),
                SireDamDamName=AV("sireDamDam","name"),      SireDamDamColor=AV("sireDamDam","color"),
                DamSireSireName=AV("damSireSire","name"),    DamSireSireColor=AV("damSireSire","color"),
                DamSireDamName=AV("damSireDam","name"),      DamSireDamColor=AV("damSireDam","color"),
                DamDamSireName=AV("damDamSire","name"),      DamDamSireColor=AV("damDamSire","color"),
                DamDamDamName=AV("damDamDam","name"),        DamDamDamColor=AV("damDamDam","color"),
                AncestryDescription=AncestryDescription or None,
            ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 5. Alpaca percents ────────────────────────────────────────────────────
    if SpeciesID == 2 and any([PercentPeruvian, PercentChilean, PercentBolivian, PercentUnknownOther, PercentAccoyo]):
        Db.add(models.AncestryPercent(
            AnimalID=AID,
            PercentPeruvian=PercentPeruvian or None,
            PercentChilean=PercentChilean or None,
            PercentBolivian=PercentBolivian or None,
            PercentUnknownOther=PercentUnknownOther or None,
            PercentAccoyo=PercentAccoyo or None,
        ))

    # ── 6. Fiber samples ──────────────────────────────────────────────────────
    if FiberSamples and SpeciesID == 2:
        try:
            for Sample in json.loads(FiberSamples):
                if not any(v for v in Sample.values() if v):
                    continue
                SD, SM, SY = None, None, None
                if Sample.get("sampleDate"):
                    try:
                        Parsed = datetime.strptime(Sample["sampleDate"], "%Y-%m-%d")
                        SD, SM, SY = Parsed.day, Parsed.month, Parsed.year
                    except ValueError:
                        pass
                Db.add(models.Fiber(
                    AnimalID=AID,
                    SampleDateDay=SD, SampleDateMonth=SM, SampleDateYear=SY,
                    AFD=ToDecimal(Sample.get("afd")),     SD=ToDecimal(Sample.get("sd")),
                    COV=ToDecimal(Sample.get("cov")),     CF=ToDecimal(Sample.get("cf")),
                    GreaterThan30=ToDecimal(Sample.get("gt30")),
                    Curve=ToDecimal(Sample.get("curve")),
                    CrimpPerInch=ToDecimal(Sample.get("crimpsPerInch")),
                    Length=ToDecimal(Sample.get("stapleLength")),
                    ShearWeight=ToDecimal(Sample.get("shearWeight")),
                    BlanketWeight=ToDecimal(Sample.get("blanketWeight")),
                ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 7. Awards ─────────────────────────────────────────────────────────────
    if Awards:
        try:
            for AwardItem in json.loads(Awards):
                if not AwardItem.get("year") and not AwardItem.get("show"):
                    continue
                Db.add(models.Award(
                    AnimalID=AID,
                    AwardYear=ToInt(AwardItem.get("year")),
                    ShowName=AwardItem.get("show") or None,
                    Type=AwardItem.get("class") or None,
                    Placing=AwardItem.get("placing") or None,
                    Awardcomments=AwardItem.get("description") or None,
                ))
        except (json.JSONDecodeError, AttributeError):
            pass

    # ── 8. Pricing ────────────────────────────────────────────────────────────
    Db.add(models.Pricing(
        AnimalID=AID,
        Price=ToDecimal(Price),       Price2=ToDecimal(Price2),
        Price3=ToDecimal(Price3),     Price4=ToDecimal(Price4),
        MinOrder1=ToInt(MinOrder1),   MinOrder2=ToInt(MinOrder2),
        MinOrder3=ToInt(MinOrder3),   MinOrder4=ToInt(MinOrder4),
        MaxOrder1=ToInt(MaxOrder1),   MaxOrder2=ToInt(MaxOrder2),
        MaxOrder3=ToInt(MaxOrder3),   MaxOrder4=ToInt(MaxOrder4),
        StudFee=ToDecimal(StudFee),
        ForSale=YesNoToBit(ForSale),  Free=YesNoToBit(Free),
        OBO=YesNoToBit(OBO),          Foundation=YesNoToBit(Foundation),
        Discount=ToInt(Discount) or 0,
        PriceComments=PriceComments or None,
        Donor=YesNoToBit(DonorMale) or YesNoToBit(DonorFemale),
        EmbryoPrice=ToDecimal(EmbryoPrice),
        SemenPrice=ToDecimal(SemenPrice),
        PayWhatYouCanStud=YesNoToBit(PayWhatYouCan),
        Sold=0,
        CoOwnerBusiness1=CoOwnerBusiness1 or None, CoOwnerName1=CoOwnerName1 or None, CoOwnerLink1=CoOwnerLink1 or None,
        CoOwnerBusiness2=CoOwnerBusiness2 or None, CoOwnerName2=CoOwnerName2 or None, CoOwnerLink2=CoOwnerLink2 or None,
        CoOwnerBusiness3=CoOwnerBusiness3 or None, CoOwnerName3=CoOwnerName3 or None, CoOwnerLink3=CoOwnerLink3 or None,
    ))

    # ── 9. Photos & documents ─────────────────────────────────────────────────
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

    PhotoFiles = [Photo1,Photo2,Photo3,Photo4,Photo5,Photo6,Photo7,Photo8,
                  Photo9,Photo10,Photo11,Photo12,Photo13,Photo14,Photo15,Photo16]
    Captions   = [Caption1,Caption2,Caption3,Caption4,Caption5,Caption6,Caption7,Caption8,
                  Caption9,Caption10,Caption11,Caption12,Caption13,Caption14,Caption15,Caption16]

    PhotoRow = models.Photo(AnimalID=AID)
    for I, (PFile, Cap) in enumerate(zip(PhotoFiles, Captions), start=1):
        Saved = await SaveFile(PFile, f"photo{I}")
        if Saved: setattr(PhotoRow, f"Photo{I}", Saved)
        if Cap:   setattr(PhotoRow, f"PhotoCaption{I}", Cap)

    PhotoRow.ARI          = await SaveFile(AriDoc,       "ari")
    PhotoRow.Histogram    = await SaveFile(HistogramDoc, "histogram")
    PhotoRow.FiberAnalysis= await SaveFile(FiberDoc,     "fiber")
    PhotoRow.AnimalVideo  = VideoEmbed or None
    Db.add(PhotoRow)

    # ── 10. Commit ────────────────────────────────────────────────────────────
    Db.commit()
    return {"animalID": AID, "status": "success"}
