<%
DBname= name
str1 = name
str2 = "'"
If InStr(str1,str2) > 0 Then
	DBname= Replace(str1, "'", "''")
	DBName = trim(DBName)
End If
Set rsCria = Server.CreateObject("ADODB.Recordset")
 If gender = "male" then
sqlCria = "select distinct Ancestors.ID, Animals.ID, Animals.FullName, Animals.category, Photos.Photo1, Colors.Color1, Colors.Color2, Colors.color3, Colors.color4, Colors.color5 from Animals, Ancestors, Photos, colors where animals.ID = Ancestors.ID and animals.ID = Colors.ID and animals.ID = Photos.ID and (trim(Dam) = '"  & DBname & "'  or trim(sire) = '"  & DBname & "')"
Else
sqlCria = "select distinct Ancestors.ID, Animals.ID, Animals.FullName, Animals.category, Photos.Photo1, Colors.Color1, Colors.Color2, Colors.color3, Colors.color4, Colors.color5 from Animals, Ancestors, Photos, colors where animals.ID = Ancestors.ID and animals.ID = Colors.ID and animals.ID = Photos.ID and (trim(Dam) = '"  & DBname & "'  or trim(sire) = '"  & DBname & "')"
End If
rsCria.Open sqlCria, conn, 3, 3 
crialink = False
if not rsCria.eof then 
crialink = True
%>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%" class = roundedtopandbottom>
<tr><td align = "center" class = "body"   >
<h2>Progeny<br></h2>
</td></tr>
<tr><td>
<table border="0" cellspacing="2"   >
<%Counter = 1
Row = 0
totalrows = 0
while not rsCria.eof 
Row = Row + 1 
totalrows = totalrows +1
If Row = 5 Then 
Row = 1
End if
CriaName 	= trim(rsCria("FullName"))
CriaID 	= rsCria("ID")
Criacategory = (rsCria("Category"))
Color1 = (rsCria("Color1"))
Color2 = (rsCria("Color2"))
Color3 = (rsCria("Color3"))
Color4 = (rsCria("Color4"))
Color5 = (rsCria("Color5"))
'response.write (Criacategory)
DetailType = "Other"
If Criacategory = "Dam" Or Criacategory = "Maiden"Then
		DetailType = "Dam"
	End If
	If Criacategory = "Herdsire" Or Criacategory = "Jr. Herdsire" Then
		DetailType = "Sire"
	End if
	If Criacategory = "Pet/ Fiber Quality"  Then
		DetailType = "Other"
	End if

	 If row = 1 Then %>
<tr>
 <%end If  %>
<td  class = 'body' align = "center" width = "140">
		  <% 
		  If CriaLink = "False" Then %>
		  
	<% If Len(rsCria("Photo1"))	> 2  Then %>
		<a href = "Details.asp?ID=<%=CriaID%>&DetailType=<%=DetailType%>" class = "body"><img src= "<%=rsCria("Photo1") %>" width = "130" class = "pictures"></a>
	<% Else %>
	<a href = "Details.asp?ID=<%=CriaID%>&DetailType=<%=DetailType%>" class = "body"><img src= "/Uploads/ImageNotAvailable.jpg" width = "130" class = "pictures"></a>
		
	<% End If %>
		
<% Else If Len(rsCria("Photo1"))> 7  Then %>
<a href = "Details.asp?ID=<%=CriaID%>&DetailType=<%=DetailType%>" class = "body"><img src= "<%=rsCria("Photo1") %>" width = "130" class ="pictures" ></a>
<br /><br />
		
<% Else %>
	<table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #811c35 ; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3" >
	<tr>
		<td>
<a href = "Details.asp?ID=<%=CriaID%>&DetailType=<%=DetailType%>" class = "body"><img src= "/uploads/ImageNotAvailable.jpg" width = "130" border = "0"></a>
		</td>
</tr>
</table>
<% End If %>
 <% End If %>
		<td>
		<td  class = 'body' colspan = "2" >
 <%If CriaLink = "False" Then %>
		<%=rsCria("FullName")%><br>
<% Else %>
	
<% if Current3= "Preview" then %>
<%=rsCria("FullName")%><br>
<% else %>
<a href = "Details.asp?ID=<%=CriaID%>&DetailType=<%=DetailType%>" class = "body"><%=rsCria("FullName")%></a><br>
<% end if %>
<% End If %>
<% If Len(color1) > 1 or Len(color2) > 1 or Len(color3) > 1 or Len(color4) > 1 Then %>
<% If Len(color1) > 1 Then %>
<%=Color1%><% end if %>
<% If Len(color2) > 1 Then %> / <%=Color2%>
<% end if %>
<% If Len(color3) > 1 Then %>
/ <%=Color3%>
<% end if %>
<% If Len(color4) > 1 Then %>
/ <%=Color4%>
<% end if %>
<% If Len(color5) > 1 Then %>
/ <%=Color5%>
 <% end if %>
 	<br>
<% end if %>
<%=rsCria("Category")%>
<br>
<br><br>
</td>
<% If row = 5 Then %>
<tr>
<%end If  %>
<% 
counter = counter +1
rsCria.movenext
wend%>
<%If totalrows = 1 Or 	totalrows = 2 Or 	totalrows = 4  Or 	totalrows = 5  Or 	totalrows = 7 Or 	totalrows = 8 then %>
</tr>
<% End If %>
<% rsCria.close
set rsCria=nothing%>
</table>
</td></tr></table>
<br>
<% End If %>
