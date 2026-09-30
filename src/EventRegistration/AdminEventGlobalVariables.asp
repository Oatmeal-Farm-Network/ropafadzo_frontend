<% 'Global Variables
Dim IDArray(999999)
Dim alpacaName(999999)
%>
<!--#Include virtual="/Conn.asp"-->
<%
PeopleID = session("PeopleID")
if Len(Session("PeopleID")) < 1 then
Session("PeopleID") = Request.Cookies("PeopleID")
PeopleID = session("PeopleID")
end if  %>
<!--#Include virtual="/members/AdminSecurityInclude.asp"-->
<%
PeopleID = session("PeopleID")
if Len(Session("PeopleID")) < 1 then
Session("PeopleID") = Request.Cookies("PeopleID")
PeopleID = session("PeopleID")
end if  

'**************************************************************
' Check if the About Us Page is listed in RanchPageLayout
'**************************************************************
sql = "select * from RanchPageLayout where PageName = 'About Us' and PeopleID = " & PeopleID
rs.Open sql, conn, 3, 3
If  rs.eof then
rs.close
Query =  "INSERT INTO RanchPageLayout (PeopleID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
Query =  Query & " Values (" &  PeopleID  & ", "
Query =  Query &  " 4," 
Query =  Query &  " 'About Us'," 
Query =  Query &  " 'PageData2.asp?pagename=About Us&PeopleID=" & PeopleID & "'," 
Query =  Query &  " 'RanchAboutUs.asp?PeopleID=" & PeopleID & "'," 
Query =  Query &  " 'About Us' ," 
Query =  Query &  " 1 ,"
Query =  Query &  " 0 )"
Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->
<%sql = "select PageLayoutID from RanchPageLayout where PeopleID = " & PeopleID & " and LinkName='About Us'"
rs.Open sql, conn, 3, 3
PageLayoutID = rs("PageLayoutID")
rs.close
X = 0
while X < 9
X = X + 1 
Query =  "INSERT INTO RanchPageLayout2 (PeopleID, BlockNum, PageLayoutID )" 
Query =  Query & " Values (" & PeopleID & ", " 
Query =  Query &  " " &  X & ", " 
Query =  Query &  " " & PageLayoutID & " )" 
Conn.Execute(Query) 
wend
else
end if 
If not rs.State = adStateClosed Then
rs.close
End If  
%>

<!--#Include virtual="/Conn.asp"-->
<% Set rsa = Server.CreateObject("ADODB.Recordset")
Set rsb = Server.CreateObject("ADODB.Recordset")

sqlb = "select * from People where Subscriptionlevel = 0"
rsb.Open sqlb, conn, 3, 3
if not rsb.eof then
while not rsb.eof 
tempPeopleID = rsb("PeopleID")
sqla = "select * from sfproducts where ProdForSale = True and PeopleID = " & tempPeopleID & " Order by ProdPrice desc"
rsa.Open sqla, conn, 3, 3
If not rsa.eof then
numPublishedproducts = rsa.recordcount    
if numPublishedproducts > 5 then
i=0
while not rsa.eof
i = i +1
TempProdId = rsa("Prodid")
if i > 1 then
Query =  " UPDATE sfproducts Set ProdForSale = False  where ProdId = " & TempProdId & ";" 
Conn.Execute(Query) 
end if
rsa.movenext
wend
end if
end if
rsa.close
sqla = "select * from animals, Pricing where animals.id = Pricing.id and PublishForSale = True and PeopleID = " & tempPeopleID & " Order by Price desc"
rsa.Open sqla, conn, 3, 3
If not rsa.eof then
numPublishedAnimals = rsa.recordcount    
if numPublishedAnimals > 1 then
i=0
while not rsa.eof
i = i +1
animalId = rsa("id")
if i > 1 then
Query =  " UPDATE Animals Set PublishForSale = False  where ID = " & animalId & ";" 
Conn.Execute(Query) 
end if
rsa.movenext
wend
end if
end if
rsa.close
rsb.movenext
wend
end if
rsb.close




sqlb = "select * from People where Subscriptionlevel = 1 or Subscriptionlevel = 18"
rsb.Open sqlb, conn, 3, 3
if not rsb.eof then
while not rsb.eof 
tempPeopleID = rsb("PeopleID")
sqla = "select * from sfproducts where ProdForSale = True and PeopleID = " & tempPeopleID & " Order by ProdPrice desc"
rsa.Open sqla, conn, 3, 3
If not rsa.eof then
numPublishedproducts = rsa.recordcount    
if numPublishedproducts > 5 then
i=0
while not rsa.eof
i = i +1
TempProdId = rsa("Prodid")
if i > 5 then
Query =  " UPDATE sfproducts Set ProdForSale = False  where ProdId = " & TempProdId & ";" 
Conn.Execute(Query) 
end if
rsa.movenext
wend
end if
end if
rsa.close
sqla = "select * from animals, Pricing where animals.id = Pricing.id and PublishForSale = True and PeopleID = " & tempPeopleID & " Order by Price desc"
rsa.Open sqla, conn, 3, 3
If not rsa.eof then
numPublishedAnimals = rsa.recordcount    
if numPublishedAnimals > 5 then
i=0
while not rsa.eof
i = i +1
animalId = rsa("id")
if i > 5 then
Query =  " UPDATE Animals Set PublishForSale = False  where ID = " & animalId & ";" 
Conn.Execute(Query) 
end if
rsa.movenext
wend
end if
end if
rsa.close
rsb.movenext
wend
end if
tempPeopleID = PeopleID
if tempPeopleID = 1802 then
sqla = "select * from animals, Pricing where animals.id = Pricing.id and PublishForSale = True and PeopleID = " & tempPeopleID & " Order by Price desc"
rsa.Open sqla, conn, 3, 3
If not rsa.eof then
numPublishedAnimals = rsa.recordcount  
End if
rsa.close
sqla = "select * from sfproducts where ProdForSale = True and PeopleID = " & tempPeopleID & " Order by ProdPrice desc"
rsa.Open sqla, conn, 3, 3
If not rsa.eof then
numPublishedproducts = rsa.recordcount  
end if
rsa.close
end if

sqla = "select * from animals where speciesID = 2 and PeopleID = " & tempPeopleID
rsa.Open sqla, conn, 3, 3
If not rsa.eof then
numAlpacas = rsa.recordcount  
End if
rsa.close

rsb.close
sqlb = "select SubscriptionLevel, custAIEndService, Preferedspecies from People where PeopleID = " & PeopleID
rsb.Open sqlb, conn, 3, 3
if not rsb.eof then
SubscriptionLevel = rsb("SubscriptionLevel")
custAIEndService  = rsb("custAIEndService")
Preferedspecies = rsb("Preferedspecies")
end if
rsb.close
 screenwidth = 989
%>
<title><%=Sitenamelong %> Administration</title>
<meta name="Title" content="<%=Sitenamelong %> Administration"/>
<meta name="robots" content="nofollow"/>
<meta name="rating" content="Safe for kids"/>
<meta name="Googlebot" content="nofollow"/>
<link rel="stylesheet" type="text/css" href="/administration/adminstyle.css" />