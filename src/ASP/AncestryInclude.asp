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
<% if mobiledevice = False and screenwidth > 700 then %>
<table border="0" cellspacing="0" cellpadding ="0" width = "100%" align = "center" >
<% else %>
<table border="0" cellspacing="0" cellpadding ="0" width = "100%" align = "left" >
<% end if %>


<tr><td class = "body roundedtopandbottom" align = "left"><H2><div align = "left">Ancestry</div></H2>
<br />
<table border="0" cellspacing="2" width = "100%" align = "center" >
<tr><td align= "center" class = "body">
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
</td></tr>
</table>
<table border="0" cellspacing="2" width = "100%" align = "center" >
<tr><td rowspan="4" class = "list" align = "Left"><%=Sireterm%><br>
<% Gender = "Male"
Ancestorname = Sire
AncestorColor = SireColor
AncestorARI = SireARI
AncestorCLAA = SireCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td>
<td rowspan="2" nowrap align = "Left">
<br>
<% Gender = "Male"
Ancestorname = SireSire
AncestorColor = SireSireColor
AncestorARI = SireSireARI
AncestorCLAA = SireSireCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td><td nowrap align = "Left">
<br>
<% Gender = "Male"
Ancestorname = SireSireSire
AncestorColor = SireSireSireColor
AncestorARI = SireSireSireARI
AncestorCLAA = SireSireSireCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr>
<tr><td align = "Left"><br>
<% Gender = "Female"
Ancestorname = SireSireDam
AncestorColor = SireSireDamColor
AncestorARI = SireSireDamARI
AncestorCLAA = SireSireDamCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr>
<tr><td rowspan="2" align = "Left"><br>
<% Gender = "Female"
Ancestorname = SireDam
AncestorColor = SireDamColor
AncestorARI = SireDamARI
AncestorCLAA = SireDamCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td><td align = "Left"><br>
<% Gender = "Male"
Ancestorname = SireDamSire
AncestorColor = SireDamSireColor
AncestorARI = SireDamSireARI
AncestorCLAA = SireDamSireCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr>
 <tr><td align = "Left"><br>
<% Gender = "Female"
Ancestorname = SireDamDam
AncestorColor = SireDamDamColor
AncestorARI = SireDamDamARI
AncestorCLAA = SireDamDamCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr>
<tr><td rowspan="4" class = "list" align = "Left"><%=DamTerm%><br>
<% Gender = "Female"
Ancestorname = dam
AncestorColor = DamColor
AncestorARI = DamARI
AncestorCLAA = DamCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td>
<td rowspan="2" align = "Left"><br>
<% Gender = "Male"
Ancestorname = DamSire
AncestorColor =DamSireColor
AncestorARI = DamSireARI
AncestorCLAA = DamSireCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td>
<td align = "Left"><br>
<% Gender = "Male"
Ancestorname = DamSireSire
AncestorColor = DamSireSireColor
AncestorARI =DamSireSireARI
AncestorCLAA = SireSireSireCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr>
<tr><td align = "Left"><br>
<% Gender = "Female"
Ancestorname = DamSireDam
AncestorColor = DamSireDamColor
AncestorARI = DamSireDamARI
AncestorCLAA = DamSireDamCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr>
<tr><td rowspan="2" align = "Left"><br>
<% Gender = "Female"
Ancestorname = DamDam
AncestorColor = DamDamColor
AncestorARI = DamDamARI
AncestorCLAA = DamDamCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td><td align = "Left"><br>
<% Gender = "Male"
Ancestorname = DamDamSire
AncestorColor = DamDamSireColor
AncestorARI = DamDamSireARI
AncestorCLAA = DamDamSireCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr>
<tr><td align = "Left"><br>
<% Gender = "Female"
Ancestorname = DamDamDam
AncestorColor = DamDamDamColor
AncestorARI = DamDamDamARI
AncestorCLAA = DamDamDamCLAA
%>
<!--#Include file="AncestorDetailsInclude.asp"-->
</td></tr></table>
</td></tr></table>
<% end if %>