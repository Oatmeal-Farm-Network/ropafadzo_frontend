<% ID= Request.QueryString("ID") 
DetailType= Request.QueryString("DetailType") 
Set rs = Server.CreateObject("ADODB.Recordset")
CurrentPeopleID = request.QueryString("CurrentPeopleID")
if len(CurrentPeopleID) > 0 then
else
sql = "select People.PeopleID from People, animals where People.PeopleID= animals.PeopleID and id = " & ID
rs.Open sql, conn, 3, 3
if not rs.eof then
CurrentPeopleID = rs("PeopleID")
else
end if 
rs.close
end if
if len(CurrentPeopleID) > 0 then
else
response.Redirect("Default.asp")
end if
sql = "select  * from People where PeopleID= " & CurrentPeopleID
rs.Open sql, conn, 3, 3
If not rs.eof then
RanchHomeText = rs("RanchHomeText")
BusinessID   = rs("BusinessID")
AddressID  = rs("AddressID")
Logo = rs("Logo")
Header = rs("Header")
str1 = RanchHomeText
str2 = vblf
If InStr(str1,str2) > 0 Then
RanchHomeText= Replace(str1, str2 , "</br>")
End If  
str1 = RanchHomeText
str2 = vbtab
If InStr(str1,str2) > 0 Then
RanchHomeText= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  
end if 
rs.close
if len(BusinessID) > 0 then
else
'response.Redirect("default.asp")
end if
sql = "select  BusinessName from Business where BusinessID= " & BusinessID
rs.Open sql, conn, 3, 3
If not rs.eof then
BusinessName = rs("BusinessName")
end if 
rs.close
sql = "select  * from Address where AddressID= " & AddressID
rs.Open sql, conn, 3, 3
If not rs.eof then
AddressCity = rs("AddressCity")
AddressState = rs("AddressState")
end if 
rs.close
sql = "select * from fiber where ID=" & ID
'response.write("sql=" & sql)
rs.Open sql, conn
If rs.eof Then 
If not rs.State = adStateClosed Then
rs.close
End If  %>
<!--#Include virtual="/includefiles/Conn.asp"-->
<%counter = 1
While counter < 11 
Query = "INSERT INTO fiber (ID)" 
Query = Query & " Values (" &  ID & ")"
Counter = counter + 1
Conn.Execute(Query) 
wend
Conn.Execute(Query) 
Conn.Close
Set Conn = Nothing 
%>
<!--#Include virtual="/includefiles/Conn.asp"-->
<%End If 
if rs.state > 0 then
rs.close
end if
sql = "select Ancestors.*, Animals.*, Photos.*, Pricing.*, colors.*,  fiber.*FROM  Colors, Animals,  fiber, Photos, Pricing, Ancestors where animals.id=Colors.id and  animals.ID = Photos.ID and animals.ID = Pricing.ID and animals.ID = Ancestors.ID And fiber.id=animals.id and Animals.ID=" & ID
gender = "non-breeder"
rs.Open sql, conn, 3, 3
if rs.eof then
response.Redirect("default.asp")
end if
if not rs.eof then 
Vaccinations = rs("Vaccinations")
Lastupdated=  rs("Lastupdated")
SpeciesID = rs("SpeciesID")
PublishStud = rs("PublishStud")
StudFee = rs("StudFee")
Price = rs("Price")
Financeterms = rs("Financeterms")
'response.write("Financeterms=" & Financeterms )
Showprices = rs("Showprices")
Free = rs("Free")
OBO = rs("OBO")
PayWhatYouCanStud = rs("PayWhatYouCanStud")
PriceComments = rs("PriceComments")
Sold = rs("Sold")
CoOwnerName1 = rs("CoOwnerName1")
CoOwnerLink1 = rs("CoOwnerLink1")
CoOwnerBusiness1 = rs("CoOwnerBusiness1")
CoOwnerName2 = rs("CoOwnerName2")
CoOwnerLink2 = rs("CoOwnerLink2")
CoOwnerBusiness2 = rs("CoOwnerBusiness2")
CoOwnerName3 = rs("CoOwnerName3")
CoOwnerLink3 = rs("CoOwnerLink3")
CoOwnerBusiness3= rs("CoOwnerBusiness3")
salepending = rs("salepending")
FullPrice = rs("price")
Discount = rs("Discount")
name = trim(rs("FullName"))
DOBday = rs("DOBday")
DOBMonth = rs("DOBMonth")
DOBYear = rs("DOBYear")
Color1 = rs("Color1")
Color2 = rs("Color2")
Color3 = rs("Color3")
Color4 = rs("Color4")
Color5 = rs("Color5")
AnimalRegistrationID = rs("AnimalRegistrationID")
Category = rs("Category")
BreedID = rs("BreedID")
BreedID2 = rs("BreedID2")
BreedID3 = rs("BreedID3")
BreedID4 = rs("BreedID4")
if len(BreedID) > 0 then
BreedID = cLng(rs("BreedID"))
end if
if len(BreedID2) > 0 then
BreedID2 = cLng(rs("BreedID2"))
end if
if len(BreedID3) > 0 then
BreedID3 = cLng(rs("BreedID3"))
end if
if len(BreedID4) > 0 then
BreedID4 = cLng(rs("BreedID4"))
end if


Weight = rs("Weight")
Height = rs("Height")
Gaited = rs("Gaited")
Warmblooded= rs("Warmblooded")
Temperment= rs("Temperment")


If InStr("2,8,17,49,51,62,63,80,82,90,91,96,98,102,103,107,117", category) > 0 Then 
Set rsb = Server.CreateObject("ADODB.Recordset")
sqlb = "SELECT DISTINCT * FROM femaledata WHERE id= " & ID & " ORDER BY ID;"
rsb.Open sqlb, conn, 3, 3   
if not rsb.eof then
 Bred =   rsb("Bred")
 ServiceSireID =   rsb("ServiceSireID")
 DueDateMonth =   rsb("DueDateMonth")
 DueDateYear =   rsb("DueDateYear")
 DueDate = DueDateMonth & "/" & DueDateYear

 ExternalStudID = rsb("ExternalStudID")
 Externalstudname= rsb("Externalstudname")
 ExternalStudLink= rsb("ExternalStudLink")
 ExternalStudColor= rsb("ExternalStudColor")
 ExternalStudPhoto = rsb("ExternalStudPhoto")

end if
end if
if not(detailtype = "Other" Or detailtype = "other") then
CF = rs("CF")
Curve = rs("Curve")
AFDFiberDiameter = rs("Average")
StandardDeviation = rs("StandardDev")
CoefficientOfVariation = rs("COV")
FiberGreaterThan30 = rs("GreaterThan30")
SampleDate = rs("SampleDate")
end if

ancestorsfound = false
Dam = rs("Dam")
if len(trim(Dam)) > 0 then
ancestorsfound = True
end if

DamColor = rs("DamColor")
if len(trim(DamColor)) > 0 and not (trim(DamColor) =  "Not Available")  then
ancestorsfound = True
end if
DamLink = rs("DamLink")
DamDam = rs("Damdam")
if len(trim(DamDam)) > 0 then
ancestorsfound = True
end if
DamDamColor = rs("DamdamColor")
if len(trim(DamDamColor)) > 0 and not (trim(DamdamColor) =  "Not Available") then
ancestorsfound = True
end if
DamDamLink = rs("DamdamLink")
DamSire = rs("DamSire")
if len(trim(DamSire)) > 0 then
ancestorsfound = True
end if
DamSireColor = rs("DamSireColor")
if len(trim(DamSireColor)) > 0 and not (trim(DamSireColor) =  "Not Available") then
ancestorsfound = True
end if
DamSireLink = rs("DamSireLink")
DamDamDam = rs("DamDamDam")
if len(trim(DamDamDam)) > 0 then
ancestorsfound = True
end if

DamDamDamColor = rs("DamDamDamColor")
if len(trim(DamDamDamColor)) > 0 and not (trim(DamDamDamColor) =  "Not Available") then
ancestorsfound = True
end if
DamDamDamLink = rs("DamDamDamLink")
DamDamSire = rs("DamDamSire")
if len(trim(DamDamSire)) > 0 then
ancestorsfound = True
end if
DamDamSireColor = rs("DamDamSireColor")
if len(trim(DamDamSireColor)) > 0 and not (trim(SireDamSireColor) =  "Not Available") then
ancestorsfound = True
end if
DamDamSireLink = rs("DamDamSireLink")
DamSireDam = rs("DamSireDam")
if len(trim(DamSireDam)) > 0 then
ancestorsfound = True
end if
DamSireDamColor = rs("DamSireDamColor")
if len(trim(DamSireDamColor)) > 0 and not (trim(DamSireDamColor) =  "Not Available") then
ancestorsfound = True
end if

DamSireDamLink = rs("DamSireDamLink")
DamSireSire = rs("DamSireSire")
if len(trim(DamSireSire)) > 0 then
ancestorsfound = True
end if
DamSireSireColor = rs("DamSireSireColor")
if len(trim(DamSireSireColor)) > 0 and not (trim(DamSireSireColor) =  "Not Available")  then
ancestorsfound = True
end if
DamSireSireLink = rs("DamSireSireLink")
Sire = rs("Sire")
if len(trim(Sire)) > 0 then
ancestorsfound = True
end if
SireColor = rs("SireColor")
if len(trim(SireColor)) > 0 and not (trim(SireColor) =  "Not Available") then
ancestorsfound = True
end if

SireLink = rs("SireLink")
SireSire = rs("SireSire")
if len(trim(SireSire)) > 0 then
ancestorsfound = True
end if
SireSireColor = rs("SireSireColor")
if len(trim(SireSireColor)) > 0 and not (trim(SireSireColor) =  "Not Available")  then
ancestorsfound = True
end if
SireSireLink = rs("SireSireLink")
Siredam = rs("Siredam")
if len(trim(Siredam)) > 0 then
ancestorsfound = True
end if
SiredamColor = rs("SiredamColor")
if len(trim(SiredamColor)) > 0 and not (trim(SiredamColor) =  "Not Available") then
ancestorsfound = True
end if
SiredamLink = rs("SiredamLink")
SireDamDam = rs("SireDamDam")
if len(trim(SireDamDam)) > 0 then
ancestorsfound = True
end if
SireDamDamColor = rs("SireDamDamColor")
if len(trim(SireDamDamColor)) > 0 and not (trim(SireDamDamColor) =  "Not Available") then
ancestorsfound = True
end if
SireDamDamLink = rs("SireDamDamLink")
SireDamSire = rs("SireDamSire")
if len(trim(SireDamSire)) > 0 then
ancestorsfound = True
end if
SireDamSireColor = rs("SireDamSireColor")
if len(trim(SireDamSireColor)) > 0 and not (trim(SireDamSireColor) =  "Not Available") then
ancestorsfound = True
end if
SireDamSireLink = rs("SireDamSireLink")
SireSireDam = rs("SireSireDam")
if len(trim(SireSireDam)) > 0 then
ancestorsfound = True
end if
SireSireDamColor = rs("SireSireDamColor")
if len(trim(SireSireDamColor)) > 0 and not (trim(SireSireDamColor) =  "Not Available")  then
ancestorsfound = True
end if
SireSireDamLink = rs("SireSireDamLink")
SireSireSire = rs("SireSireSire")
if len(trim(SireSireSire)) > 0 then
ancestorsfound = True
end if
SireSireSireColor = rs("SireSireSireColor")
if len(trim(SireSireSireColor)) > 0 and not (trim(SireSireSireColor) =  "Not Available") then
ancestorsfound = True
end if

SireSireSireLink = rs("SireSireSireLink")
Description = rs("Description")
StudDescription = rs("StudDescription")
if len(trim(StudDescription)) > 2 then
else
StudDescription = Description
end if
if DamLink= "0" or IsEmpty(DamLink) or len(DamLink) < 5 then
else
DamLinkDescription = "Click Here"
end if 
if DamDamLink = "0"  or IsEmpty(DamDamLink) or len(DamDamLink) < 5then
else
DamDamLinkDescription = "Click Here"
end if 
if DamSireLink= "0" or IsEmpty(DamSireLink) or len(DamSireLink) < 5 then
else
DamSireLinkDescription = "Click Here"
end if 
if SireLink= "0" or IsEmpty(SireLink) or len(SireLink) < 5 then
else
SireLinkDescription = "Click Here"
end if 
if SiredamLink= "0" or IsEmpty(SiredamLink) or len(SiredamLink) < 5 then
else
SiredamLinkDescription = "Click Here"
end if 
if SireSireLink= "0" or IsEmpty(SireSireLink) or len(SireSireLink) < 5 then
else
SireSireLinkDescription = "Click Here"
end if 

end If
if len(AnimalRegistrationID) > 0 then
Set rsA = Server.CreateObject("ADODB.Recordset")
sqlA = "select RegNumber FROM  AnimalRegistration where AnimalRegistrationID = " & AnimalRegistrationID
rsA.Open sqlA, conn, 3, 3
if not rsA.eof then 
ARI= rsA("RegNumber")
end if
rsA.close
end if

If not rs.State = adStateClosed Then
rs.close
End If  
%>
<!--#Include virtual="/includefiles/Conn.asp"-->
<%
TotalPics=0
Set rsA = Server.CreateObject("ADODB.Recordset")
sql = "select * from Photos where ID=" & ID 
rsA.Open sql, conn, 3, 3 
ARIPhoto = rsA("ARI")
AnimalVideo = rsA("AnimalVideo")
HistogramPhoto = rsA("Histogram")
FiberAnalysisPhoto = rsA("FiberAnalysis")

'if len(ARIPhoto) > 4 then
'str1 = lcase(ARIPhoto)
'str2 = "uploads"
'str3 = "http://"
'If Not(InStr(str1,str2) > 0) and Not(InStr(str1,str3) > 0) Then
'ARIPhoto = "http://www.livestockofamerica.com/Uploads/" & ARIPhoto
'End If 
'str1 = lcase(ARIPhoto)
'str2 = "uploads"
'str3 = "http://"
'If  InStr(str1,str2) > 0 and Not(InStr(str1,str3) > 0) Then
'ARIPhoto = "http://www.livestockofamerica.com/" & ARIPhoto
'End If 
'end if

if len(HistogramPhoto) > 4 then
str1 = lcase(HistogramPhoto)
str2 = "uploads"
str3 = "http://"
If Not(InStr(str1,str2) > 0) and Not(InStr(str1,str3) > 0) Then
HistogramPhoto = "http://www.livestockofamerica.com/Uploads/" & HistogramPhoto
End If 

str1 = lcase(HistogramPhoto)
str2 = "uploads"
str3 = "http://"
If  InStr(str1,str2) > 0 and Not(InStr(str1,str3) > 0) Then
HistogramPhoto = "http://www.livestockofamerica.com/" & HistogramPhoto
End If 
end if

if len(FiberAnalysisPhoto) > 4 then
str1 = lcase(FiberAnalysisPhoto)
str2 = "uploads"
str3 = "http://"
If Not(InStr(str1,str2) > 0) and Not(InStr(str1,str3) > 0) Then
FiberAnalysisPhoto = "http://www.livestockofamerica.com/Uploads/" & FiberAnalysisPhoto
End If 
str1 = lcase(FiberAnalysisPhoto)
str2 = "uploads"
str3 = "http://"
If  InStr(str1,str2) > 0 and Not(InStr(str1,str3) > 0) Then
FiberAnalysisPhoto = "http://www.livestockofamerica.com/" & FiberAnalysisPhoto
End If 
end if

str1 = lcase(FiberAnalysisPhoto)
str2 = "http://www.alpacainfinity.com"
If InStr(str1,str2) > 0 Then
FiberAnalysisPhoto= Replace(str1, str2 , "http://www.livestockofamerica.com")
End If  

str1 = lcase(ARIPhoto)
str2 = "http://www.alpacainfinity.com"
If InStr(str1,str2) > 0 Then
ARIPhoto= Replace(str1, str2 , "http://www.livestockofamerica.com")
End If  


str1 = lcase(HistogramPhoto)
str2 = "http://www.alpacainfinity.com"
If InStr(str1,str2) > 0 Then
HistogramPhoto= Replace(str1, str2 , "http://www.livestockofamerica.com")
End If  

If Len(trim(rsA("Photo1"))) > 4 or  Len(trim(rsA("Photo2")))  > 4 or Len(trim(rsA("Photo3")))  > 4 or Len(trim(rsA("Photo4")))  > 4 or Len(trim(rsA("Photo5")))  > 4 or Len(trim(rsA("Photo6")))  > 4 or Len(trim(rsA("Photo7")))  > 4 or Len(trim(rsA("Photo8"))) > 4 or Len(trim(rsA("Photo9"))) > 4 or Len(trim(rsA("Photo10"))) > 4 or Len(trim(rsA("Photo11"))) > 4 or Len(trim(rsA("Photo12"))) > 4 or Len(trim(rsA("Photo13"))) > 4 or Len(trim(rsA("Photo14"))) > 4 or Len(trim(rsA("Photo15"))) > 4 or Len(trim(rsA("Photo16"))) > 4  then 
noimage = false
Else 
click = "<img width=""260"" src=""https://www.livestockoftheworld.com/Uploads/ImageNotAvailable.jpg""> "
noimage = True
End If
if not rsA.eof then 
pcounter = 0
counter = 0
counttotal = 16
While counter < counttotal
counter = counter +1
Photonum = "Photo" & counter
Captionnum = "PhotoCaption" & counter
image = rsA(Photonum)
if image= "0" then image = ""
Caption = rsA(Captionnum)
If Len(image)> 2 Then
pcounter = pcounter +1
TotalPics= TotalPics + 1


str1 = lcase(image)
str2 = "uploads"
str3 = "http://"
If Not(InStr(str1,str2) > 0) and Not(InStr(str1,str3) > 0) Then
image = "https://www.livestockoftheworld.com/Uploads/" & image
End If 

str1 = lcase(image)
str2 = "https://www.alpacainfinity.com"
If InStr(str1,str2) > 0 Then
image= Replace(str1, str2 , "http://www.livestockoftheworld.com")
End If  


str1 = lcase(image)
str2 = "uploads"
str3 = "http://"
If  InStr(str1,str2) > 0 and Not(InStr(str1,str3) > 0) Then
'image = "https://www.livestockoftheworld.com/" & image
End If 

str1 = lcase(image)
str2 = "//uploads"
If  InStr(str1,str2) > 0 Then
image= Replace(str1, str2 , "/uploads")
End If 



if trim(lcase(image))= "https://www.livestockofamerica.com/uploads/"  then
	image= "https://www.livestockoftheworld.com/uploads/ImageNotAvailable.jpg"
end if

if Len(image) > 1 then
Else
	image= "https://www.livestockoftheworld.com/uploads/ImageNotAvailable.jpg"
end if

if len(image) = 135 then
image = "https://www.livestockoftheworld.com/images/ImageNotAvailable.jpg"
end if 

'if len(image) < 50 then
'photoID = "https://www.livestockoftheworld.com/" & photoID
'end if 
str1 = lcase(image)
str2 = "livestockofamerica.com"
If InStr(str1,str2) > 0 Then
	image= Replace(str1, str2 , "livestockoftheworld.com")
End If  

	 str1 = lcase(image)
            str2 = "livestockofamerica.com"
            If InStr(str1,str2) > 0 Then
	            image= Replace(str1, str2 , "livestockoftheworld.com")
            End If 

            str1 = lcase(image)
            str2 = "http:"
            If InStr(str1,str2) > 0 Then
	            image= Replace(str1, str2 , "https:")
            End If 



            if trim(lcase(image))= "https://www.livestockofamerica.com/uploads/"  then
	            image = "https://www.livestockoftheworld.com/uploads/ImageNotAvailable.jpg"
            end if

            if Len(image) > 1 then
            Else
	            image = "https://www.livestockoftheworld.com/uploads/ImageNotAvailable.jpg"
            end if

            if len(image) = 135 then
                image = "https://www.livestockoftheworld.com/images/ImageNotAvailable.jpg"
            end if 

            if len(image) < 50 then
                image = "https://www.livestockoftheworld.com/" & image
            end if 



buttonimages(pcounter) = image
buttontitle(pcounter) = Caption
%>
<script language="JavaScript">
if (document.images) version = "n3";
else version = "n2";
if (version == "n3") {
but<%=pcounter%>on = new Image(85, 115);
but<%=pcounter%>on.src = "<%=image%>";
}
function img<%=pcounter%>(imgName) {
if (version == "n3") {
imgOn = eval("but<%=pcounter%>on.src");
document [imgName].src = imgOn;               }       }
</script>
<% End if
wend
end if 

if len(SpeciesID) > 0 then
sql2 = "select * from SpeciesAvailable where  SpeciesID = " & SpeciesID 
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
SireTerm = rs2("SireTerm")
DamTerm = rs2("DamTerm")
rs2.close
end if
%>