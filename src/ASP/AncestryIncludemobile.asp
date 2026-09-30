<% if ancestorsfound= True then
Set rsa = Server.CreateObject("ADODB.Recordset")
sql = "select AncestryPercents.* from AncestryPercents where id = " & ID
'response.write(sql)
rsa.Open sql, conn, 3, 3
if not rsa.eof then
PercentPeruvian = rsa("PercentPeruvian")
PercentBolivian  = rsa("PercentBolivian")
PercentChilean = rsa("PercentChilean")
PercentUnknownOther = rsa("PercentUnknownOther")
PercentAccoyo = rsa("PercentAccoyo")
end if
rsA.close
%><a name = "Ancestry"></a>
<table border="0" cellspacing="0" cellpadding ="1" width = "<%=screenwidth %>" align = "left" >
<tr>
<td align= "center" class = "body roundedtopandbottom">
<br />

<% If PercentAccoyo = "Full Accoyo" or PercentAccoyo = "FullAccoyo" then %>
<b>Full Accoyo</b>
<%else If Len(PercentAccoyo) > 1 And  Len(PercentAccoyo) < 5  then %>
<b><%=PercentAccoyo%> Accoyo</b>
<% End If %>
&nbsp;
<% End If %>
<% If PercentPeruvian = "FullPeruvian" Or PercentPeruvian = "Full Peruvian" then %>
<b>Full Peruvian</b>
<%else If Len(PercentPeruvian) > 1 And  Len(PercentPeruvian) < 5  then %>
<b><%=PercentPeruvian%> Peruvian</b>
<% End If %>
&nbsp;
<% End If %>
<% If PercentBolivian = "Full Bolivian" then %>
<b>Full Bolivian</b>
<%else If Len(PercentBolivian) > 1 And  Len(PercentBolivian) < 5  then %>
<b><%=PercentBolivian%> Bolivian</b>
<% End If %>
&nbsp;
<% End If %>
<% If PercentChilean = "Full Chilean" then %>
<b>Full Chilean</b>
<%else If Len(PercentChilean) > 1 And  Len(PercentChilean) < 5  then %>
<b><%=PercentChilean%> Chilean</b>
<% End If %>
&nbsp;
<% End If %>
<% If PercentUnknownOther = "100% Unknown" then %>
<b>Ancestry Origins Unknown / Other</b>
<%else If Len(PercentUnknownOther) > 1 And  Len(PercentUnknownOther) < 5  then %>
<b><%=PercentUnknownOther%> Unknown/Other</b>
<% End If %>
&nbsp;
<% End If %>
<br>
<% Gender = "Male"
Ancestorname = Sire
AncestorColor = SireColor
AncestorARI = SireARI
AncestorCLAA = SireCLAA
%>

 <%=SireTerm%>
 <blockquote>
<%
str1 = Ancestorname
str2 = "''"
If InStr(str1,str2) > 0 Then
Ancestorname= Replace(str1,  str2, "'")
End If 
str1 = trim(AncestorColor)
str2 = "Not Available"
If InStr(str1,str2) > 0 Then
AncestorColor= Replace(str1,  str2, "")
End If 
 %>
<% if len(Ancestorname) > 1 then %><%=Ancestorname%>&nbsp;<% End If %><br>
<%=AncestorColor%>&nbsp;<br>
</blockquote>


<%=DamTerm%><blockquote>
<% Gender = "Female"
Ancestorname = dam
AncestorColor = DamColor
AncestorARI = DamARI
AncestorCLAA = DamCLAA

str1 = Ancestorname
str2 = "''"
If InStr(str1,str2) > 0 Then
Ancestorname= Replace(str1,  str2, "'")
End If 
str1 = trim(AncestorColor)
str2 = "Not Available"
If InStr(str1,str2) > 0 Then
AncestorColor= Replace(str1,  str2, "")
End If 

if len(Ancestorname) > 1 then %><%=Ancestorname%>&nbsp;<% End If %><br>
<%=AncestorColor%>&nbsp;<br>
</blockquote>
</td></tr></table>
<% end if %>

